import prisma from "../PrismaClient.js";
//Build a binary matrix where 1 means users has saved the song and 0 means user hasn't
async function buildUserSongMatrix() {
  const users = await prisma.user.findMany();
  const songs = await prisma.song.findMany();
  //Create lookup table because I can't use raw id's to represent index in the 2d array(matrix)
  const userIdToIndex = {};
  const songIdToIndex = {};
  users.forEach((user, index) => (userIdToIndex[user.id] = index));
  songs.forEach((song, index) => (songIdToIndex[song.id] = index));
  // Create a matrix filled with zeros with dimensions: totalusers x totalsongs
  const matrix = Array(users.length)
    .fill()
    .map(() => Array(songs.length).fill(0));

  // Fill matrix with 1s where users have saved songs
  const savedSongs = await prisma.savedSong.findMany();
  savedSongs.forEach((saved) => {
    const userIndex = userIdToIndex[saved.userId];
    const songIndex = songIdToIndex[saved.songId];
    matrix[userIndex][songIndex] = 1;
  });
  console.log(matrix);

  return {
    matrix,
    userIdToIndex,
    songIdToIndex,
  };
}
