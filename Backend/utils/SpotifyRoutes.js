import { getSpotifyToken } from './SpotifyToken.js';
 export async function fetchSeedSongs(playlistId){
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=30`, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + token
      },
    });
    const data = await response.json()
    return data.items.map((item) => ({
       title: item.track.name,
       artist: item.track.artists[0].name,
       coverUrl: item.track.album.images[0].url,
       }))
  }
