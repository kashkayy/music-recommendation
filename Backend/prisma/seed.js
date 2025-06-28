import { PrismaClient } from "../generated/prisma/index.js"
import { fetchSeedSongs } from "../utils/SpotifyRoutes.js"
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
export const defaultLat = 10.0
export const defaultLng = 20.0
async function main() {
  await prisma.user.create({
    data: {
      username: 'suki',
      email: 'suki@google.com',
      passwordhash: bcrypt.hashSync('google', 10),
    },
  })
  const songs = await fetchSeedSongs('5ABHKGoOzxkaa28ttQV9sE')
  for (const song of songs){
    await prisma.songRanking.create({
      data: {
        song: {
          create: {
              title: song.title,
              artist: song.artist,
              coverUrl: song.coverUrl,
            },
        },
        lat: defaultLat,         
        lng: defaultLng,
        score: 1,
      },
    });
  }
}
main().finally(async () => {
    await prisma.$disconnect();
  });
