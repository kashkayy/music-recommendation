import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient();
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