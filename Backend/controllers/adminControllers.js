import prisma from "../PrismaClient.js";
import { Role } from "../generated/prisma/index.js";
export async function getSongRegion(songId){
  const song = await prisma.savedSong.findUnique({
    where : {id: Number(songId)}
  })
  if(!song){
    throw new Error("Song does not exist")
  }else{
    return song.region
  }
}

export async function getUserRegion(userId){
  const user = await prisma.user.findUnique({
    where : {id: Number(userId)}
  })
  if(!user){
    throw new Error("User does not exist")
  }else{
    return user.region
  }
}

export async function getAllUsers(adminRegion, userRole) {
  if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  try {
    if(userRole === Role.admin){
      return await prisma.user.findMany({
        where: {
          OR: [
            {role: Role.user},
            {role: Role.regionAdmin},
          ]
        }
      });
    }
    if(userRole === Role.regionAdmin){
      return await prisma.user.findMany({
        where: {region: adminRegion, role: Role.user}
      })
    }
  } catch (err) {
    throw new Error("Error fetching users")
  }
}

export async function getAllSongs(adminRegion, userRole){
  if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  try{
    if(userRole === Role.admin){
      return await prisma.savedSong.findMany()
    }
    if(userRole === Role.regionAdmin){
      return await prisma.savedSong.findMany({
        where: {region: adminRegion}
      })
    }
  }catch(error){
    throw new Error("Error fetching songs for admin")
  }
}

export async function getTopSongs(adminRegion, userRole){
  if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  try{
    if(userRole === Role.admin){
      const songLimit = 25
      const globalTopSongs = await prisma.$queryRaw`
      SELECT
        s.id AS id,
        s.title AS title,
        s.artist AS artist,
        s."coverUrl" AS "coverUrl",
        COUNT(ss."songId")::integer AS saves
      FROM
        "SavedSong" ss
      JOIN
        "Song" s ON ss."songId" = s.id
      GROUP BY
        s.id, s.title, s.artist, s."coverUrl"
      ORDER BY
        saves DESC
      LIMIT CAST(${songLimit} AS INT)
      `
      return globalTopSongs
    }
    if(userRole === Role.regionAdmin){
      const songLimit = 10
      const regionTopSongs = await prisma.$queryRaw`
      SELECT
        s.id AS id,
        s.title AS title,
        s.artist AS artist,
        s."coverUrl" AS “coverUrl”,
        COUNT(ss."songId")::integer AS saves
      FROM
        "SavedSong" ss
      JOIN
        "Song" s ON ss."songId" = s.id
      WHERE
        ss.region = CAST(${adminRegion} AS VARCHAR)
      GROUP BY
        s.id, s.title, s.artist, s."coverUrl"
      ORDER BY
        saves DESC
      LIMIT CAST(${songLimit} AS INT)
      `
      return regionTopSongs
    }
  }catch(error){
    throw new Error("Error fetching top songs")
  }
}

export async function getTopUsers(adminRegion, userRole){
  if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  try{
    if(userRole === Role.admin){
      const userLimit = 25
      const globalTopUsers = await prisma.$queryRaw`
      SELECT
        u.id AS id,
        u.username AS username,
        u.region AS region,
        COUNT(ss."userId")::integer AS "savedSongs"
      FROM
        "SavedSong" ss
      JOIN
        "User" u ON ss."userId" = u.id
      GROUP BY
        u.id, u.username, u.region
      ORDER BY
        "savedSongs" DESC
      LIMIT CAST(${userLimit} AS INT)
      `
      return globalTopUsers
    }
    if(userRole === Role.regionAdmin){
      const userLimit = 10
      const regionTopUsers = await prisma.$queryRaw`
      SELECT
        u.id AS id,
        u.username AS username,
        u.region AS region,
        COUNT(ss."userId")::integer AS "savedSongs"
      FROM
        "SavedSong" ss
      JOIN
        "User" u ON ss."userId" = u.id
      WHERE
        u.region = CAST(${adminRegion} AS VARCHAR) AND u.role = 'user'
      GROUP BY
        u.id, u.username, u.region
      ORDER BY
        "savedSongs" DESC
      LIMIT CAST(${userLimit} AS INT)
      `
      return regionTopUsers
    }
  }catch(error){
    throw new Error("Error fetching top users")
  }
}