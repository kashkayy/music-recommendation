import prisma from "../PrismaClient.js";
export async function checkStatus(username) {
  try {
    const status = await prisma.user.findFirst({
      where: {
        username: username,
        isBanned: false,
      },
    });
    return status;
  } catch (err) {
    throw new Error("User is banned");
  }
}
