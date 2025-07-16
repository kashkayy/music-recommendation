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
    if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  } catch (err) {
    throw new Error("Error fetching users")
  }
}
export async function getAllSongs(adminRegion, userRole){
  try{
    if(userRole === Role.admin){
      return await prisma.savedSong.findMany()
    }
    if(userRole === Role.regionAdmin){
      return await prisma.savedSong.findMany({
        where: {region: adminRegion}
      })
    }
    if(userRole === Role.user){
      throw new Error("Forbidden: not an admin")
    }
  }catch(error){
    throw new Error("Error fetching songs for admin")
  }
}