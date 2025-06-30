import prisma from './prisma/seed.js';
import bcrypt from 'bcrypt'
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
      lat: {gte: lat - 1, lte: lat + 1},
      lng: {gte: lng - 1, lte: lng + 1}
    },
    include: {song: true},
    orderBy: {score: 'desc'},
  })
}
export async function getSavedSongsForUser(userId) {
  try {
    return await prisma.savedSong.findMany({
      where: {userId: userId},
      include: {
        song: true
      }
    })
  } catch (err) {
    console.log("Error fetching saved songs for this user", err)
  }
}
export async function createSavedSong(userId, songId, userLat, userLng){
  try{
    return await prisma.savedSong.create({
      data:{
        songId: songId,
        userId: userId,
        lat: userLat,
        lng: userLng,
      }
    })
  }catch(err){
    console.log("Error adding song to list", err)
  }
}