import { getSpotifyToken } from './SpotifyToken.js';
 export async function fetchSeedSongs(playlistId){
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=30`, {
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
 export async function fetchSearchResults(query){
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + token
      },
    });
    const data = await response.json()
    return data.tracks.items.map((item) => ({
       title: item.name,
       artist: item.artists[0].name,
       coverUrl: item.album.images[0].url,
       }))
  }
