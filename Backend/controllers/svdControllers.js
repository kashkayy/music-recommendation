import prisma from "../PrismaClient.js";
import singularValueDecomposition from "../utils/MatrixHelper.js";
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

  return {
    matrix,
    userIdToIndex,
    songIdToIndex,
  };
}
export async function getSvdResults(userId, limit = 15) {
  if (!userId) throw new Error("userId is required");
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    const { matrix, userIdToIndex, songIdToIndex } =
      await buildUserSongMatrix();
    const userIndex = userIdToIndex[userId];
    //Checks if user exists in the matrix
    if (userIndex === undefined) {
      return [];
    }
    // Number of patterns/leading singular values we wish to find
    const numOfComponents = 5;
    const { singularValues, leftVectors, rightVectors } =
      singularValueDecomposition(matrix, numOfComponents);
    const userSavedSongs = await prisma.savedSong.findMany({
      where: { userId },
      select: { songId: true },
    });
    // avoid recommending these songs
    const userSavedSongIds = new Set(
      userSavedSongs.map((saved) => saved.songId)
    );
    // This array stores how much a user will like each song in DB. This is determined by calculating the predictiion score.
    const predictions = [];
    for (const [songIdStr, songIndex] of Object.entries(songIdToIndex)) {
      const songId = parseInt(songIdStr);
      //skip if user has saved this song
      if (userSavedSongIds.has(songId)) continue;
      //predictionScore represents (strength of patterns * how much user corresponds with pattern * how much song exhibits this pattern/feature)
      let predictionScore = 0;
      for (let i = 0; i < numOfComponents; i++) {
        predictionScore +=
          singularValues[i] *
          leftVectors[i][userIndex] *
          rightVectors[i][songIndex];
      }
      predictions.push({ songId, predictionScore });
    }
    //Get the most important predictions by sorting by predictionScores
    predictions.sort((a, b) => b.predictionScore - a.predictionScore);
    const topPredictions = predictions.slice(0, limit);
    //we get the song info for the topPredictions/ recommended songs
    const recommendedSongs = await prisma.song.findMany({
      where: {
        id: { in: topPredictions.map((p) => p.songId) },
      },
    });
    return recommendedSongs;
  } catch (error) {
    throw new Error("Unable to get SVD recommendations.");
  }
}
