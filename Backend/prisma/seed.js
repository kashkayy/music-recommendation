import prisma from '../PrismaClient.js'
import { fetchSeedSongs } from "../utils/SpotifyRoutes.js"
import bcrypt from 'bcrypt'
export const defaultLat = 10.0
export const defaultLng = 20.0
async function main() {
  const testUser1 = await prisma.user.upsert({
    where: { username: 'testuser1' },
    update: {},
    create: {
      username: 'testuser1',
      passwordhash: bcrypt.hashSync('password123', 10),
      role: 'user'
    }
  });

  const testUser2 = await prisma.user.upsert({
    where: { username: 'testuser2' },
    update: {},
    create: {
      username: 'testuser2',
      passwordhash: bcrypt.hashSync('password123', 10),
      role: 'user'
    }
  });
  const songs = await fetchSeedSongs('5ABHKGoOzxkaa28ttQV9sE');
  const createdSongs = [];
  for (const song of songs){
    const createdSongRanking = await prisma.songRanking.create({
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
        score: Math.floor(Math.random() * 100) + 1,
      },
      include: {
        song: true
      }
    });
    createdSongs.push(createdSongRanking.song);
  }
  for (let i = 0; i < Math.min(5, createdSongs.length); i++) {
    await prisma.savedSong.create({
      data: {
        songId: createdSongs[i].id,
        userId: testUser1.id,
        lat: defaultLat + (Math.random() * 0.2 - 0.1), 
        lng: defaultLng + (Math.random() * 0.2 - 0.1) 
      }
    });
  }
  for (let i = 3; i < Math.min(8, createdSongs.length); i++) {
    await prisma.savedSong.create({
      data: {
        songId: createdSongs[i].id,
        userId: testUser2.id,
        lat: defaultLat + 1.0 + (Math.random() * 0.2 - 0.1), // Different location
        lng: defaultLng + 1.0 + (Math.random() * 0.2 - 0.1)  // Different location
      }
    });
  }
}
main().finally(async () => {
  await prisma.$disconnect()
})
