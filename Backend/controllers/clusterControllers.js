import prisma from '../PrismaClient'
export async function getClustersData(latMin, latMax, lngMin, lngMax) {
    try {
        return await prisma.savedSong.groupBy({
            by: ['roundedLat', 'roundedLng', 'songId'],
            where: {
                lat: { gte: latMin, lte: latMax },
                lat: { gte: lngMin, lte: lngMax }
            },
            _count: {
                songId: true
            },
            orderBy: {
                _count: {
                    songId: 'desc'
                }
            }
        })
    } catch (err) {
        throw new Error("Error getting clusters data")
    }
}
export async function getTopSongs(roundedLat, roundedLng) {
    try {
        const songs = await prisma.savedSong.findMany({
            where: {
                roundedLat,
                roundedLng
            },
            include: {
                song: true
            }
        })
        const songMap = {}
        for (const item of songs) {
            const id = item.songId
            if (songMap[id]) {
                songMap[id].count++
            }
            else {
                songMap[id] = {
                    count: 1,
                    song: item.song
                }
            }
        }
        return Object.values(songMap).sort((a, b) => b.count - a.count).slice(0, 5)
    } catch (err) {
        throw new Error("Error getting top songs")
    }
}
