import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient();
export async function createUser(username, password) {
  return await prisma.user.create({
    data: {
      username,
      password,
    }
  })
}
export default prisma