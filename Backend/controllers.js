import prisma from './PrismaClient.js';
import bcrypt from 'bcrypt'
import { fetchSearchResults } from './utils/SpotifyRoutes.js';
import { Role } from './generated/prisma/index.js';
export async function createUser(username, password) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw new Error('Username already exists.');
  }
  try{
    const passwordhash = bcrypt.hashSync(password, 10)
    return await prisma.user.create({
      data: {
        username,
        passwordhash,
      },
    })
  }catch(err){
    console.log("Error creating user: ", err)
  }
}
export async function login(username, password){
  try{
    const getUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    if (!getUser){
      return
    }
    const passwordIsCorrect = await bcrypt.compare(password, getUser.passwordhash)
    if (!passwordIsCorrect){
      return
    }
    return getUser
  }catch(error){
    console.log("Error logging in: ", err)
  }
}
export async function getTrendingSongs(lat,lng){
  return prisma.songRanking.findMany({
    where:{
      lat: {gte: lat - 3, lte: lat + 3},
      lng: {gte: lng - 3, lte: lng + 3}
    },
    include: {song: true},
    orderBy: {score: 'desc'},
    take: 30,
  })
}
export async function getSavedSongsForUser(userId) {
    try {
      return await prisma.savedSong.findMany({
        where: {userId: userId},
        include: {song: true}
      })
    } catch (err) {
      console.log("Error fetching saved songs for this user", err)
    }
  }
export async function findOrCreateSong(title, artist, coverUrl) {
  try {
    let song = await prisma.song.findFirst({
      where: {
        title: title,
        artist: artist
      }
    });
    if (!song) {
      song = await prisma.song.create({
        data: {
          title: title,
          artist: artist,
          coverUrl: coverUrl
        }
      });
    }
    return song;
  } catch (err) {
    console.log("Error finding or creating song", err);
  }
}
export async function createSavedSong(userId, songId, title, artist, coverUrl, userLat, userLng){
  try{
    const song = await findOrCreateSong(title, artist, coverUrl);
    const savedSong = await prisma.savedSong.create({
      data:{
        songId: song.id || songId,
        userId: userId,
        lat: userLat,
        lng: userLng,
      },
    });
    await findOrCreateSongRanking(song.id || songId, userLat, userLng);
    return savedSong
  }catch(err){
    console.log("Error adding song to list", err);
  }
}
export async function findOrCreateSongRanking(songId, lat, lng) {
  try {
    let songRanking = await prisma.songRanking.findFirst({
      where: {
        songId: songId,
        lat: {gte: lat - 1, lte: lat + 1},
        lng: {gte: lng - 1, lte: lng + 1}
      },
    })
    if (!songRanking) {
      songRanking = await prisma.songRanking.create({
        data: {
          songId: songId,
          score: 1,
          lat: lat,
          lng: lng,
        }
      });
    }else{
      songRanking = await prisma.songRanking.update({
        where: {
          id: songRanking.id
        }, data: {
          score: songRanking.score + 1
        }
      })
  }
    return songRanking;
  }catch (err) {
    console.log("Error finding or creating song ranking", err);
  }
}
export async function searchResults(searchQuery){
  try{
    const searchResults = fetchSearchResults(searchQuery)
    return searchResults
  }catch(err){
    console.log("Error fetching search results", err)
  }
}
export async function deleteSavedSong(songId, userId, lat, lng){
  try{
    let songRanking = await prisma.songRanking.findFirst({
      where: {
        songId: Number(songId),
        lat: {gte: lat - 1, lte: lat + 1},
        lng: {gte: lng - 1, lte: lng + 1}
      },
    })
    const results = await prisma.savedSong.delete({
      where:{
        songId_userId:{
          songId: Number(songId),
          userId: userId,
        }
      }
    })
    songRanking = await prisma.songRanking.update({
      where:{
        id: songRanking.id
      }, data: {
        score: songRanking.score - 1
      }
    })
    return results
  }catch(err){
    console.log("Error deleting song from favorites", err)
  }
}
export async function getAllUsers(){
  try{
    return await prisma.user.findMany()
  }catch(err){
    console.log("Error fetching all users", err)
  }
}
export async function getUserById(userId){
  try{
    return await prisma.user.findUnique({
      where:{ id: userId}
    })
  }catch(err){
    console.log("Error fetching user by id", err)
  }
}
export async function getAllSongs(){
  try{
    return await prisma.song.findMany()
  }catch(err){
    console.log("Error fetching all songs", err)
  }
}
export async function getSongById(songId){
  try{
    return await prisma.song.findUnique({
      where:{ id: songId}
    })
  }catch(err){
    console.log("Error fetching song by id", err)
  }
}
export async function getTopTrendingSongs(){
  try{
    return await prisma.song.findMany({
      orderBy : {
        savedBy: {
          _count: 'desc'
        },
      },
      include : {
        _count:{
          select: {savedBy: true}
        }
      },
      take: 10,
    })
  }catch(err){
    console.log("Error fetching top 10", err)
  }
}
export async function getTopUsers(){
  try{
    return await prisma.user.findMany({
      orderBy: {
        savedSongs: {
          _count : 'desc'
        },
      },
       include : {
        _count:{
          select: {savedSongs: true}
        }
      },
      take: 10,
    })
  }catch(err){
    console.log("Error fetching top users", err)
  }
}
export async function toggleAdmin(userId){
  try{
    const getUser= await prisma.user.findUnique({
      where: {id: Number(userId)}
    })
    if(!getUser) return "Try again"
    const newRole = (getUser.role === Role.admin? Role.user : Role.admin)
    const updatedUser = prisma.user.update({
      where: {id: Number(userId)},
      data: {role: newRole}
    })
    return updatedUser
  }catch(err){
    console.log("Cannot change role at this time", err)
  }
}
export async function toggleBan(userId){
  try{
    const getUser = await prisma.user.findUnique({
      where: {id: Number(userId)}
    })
    if(!getUser) return "Try again"
    const newStatus = (getUser.isBanned? false : true)
    const updatedUser = prisma.user.update({
      where: {id: Number(userId)},
      data: {isBanned: newStatus}
    })
    return updatedUser
  }catch(err){
    throw err
  }
}