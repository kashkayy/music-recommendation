import express from 'express'
import { getSpotifyToken } from '../SpotifyToken.js';
const router = express.Router()
router.get('/spotify/topsongs/:location', async (req, res) => {
  const location = req.params.location.toLowerCase();
  const playlistMap = {nigeria: '2tAv9JR7er6YCkBkDWgrAd'}
  const playlistId = playlistMap[location]
  if (!playlistId) return res.status(404).json({ error: 'Country not supported' })
  try {
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=30`, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + token
      },
    });
    const data = await response.json()
    const songs = data.items.map((item) => ({
       title: item.track.name,
       artist: item.track.artists[0].name,
       }))
    res.status(200).json({results: songs})
  }catch(err){
    res.status(500).json({message: err.message})
  }})
export default router