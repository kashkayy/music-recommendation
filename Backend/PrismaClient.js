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
    const passwordhash = bcrypt.hashSync(password, 15)
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
export default prisma