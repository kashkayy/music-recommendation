import express from 'express'
import {createSavedSong, getSavedSongsForUser, deleteSavedSong } from '../controllers.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
const router = express.Router()
router.get('/', authenticateToken, async (req, res) => {
  try{
    const savedSongs = await getSavedSongsForUser(req.user.id)
    res.status(200).json({message: "Successfully got saved songs", ok:true, results: savedSongs})
  }catch(err){
    res.status(500).json({message: "Error getting saved songs", ok:false})
  }
})
router.post('/save',authenticateToken, async (req, res) => {
  const {songId, title, artist, coverUrl, lat, lng} = req.body
  const userId = req.user.id
  if(!lat || !lng){
    return res.json({message: "Allow Sound Map access your location"})
  }
  try{
    await createSavedSong(userId, songId, title, artist, coverUrl, lat, lng)
    const updatedlist = await getSavedSongsForUser(req.user.id)
    res.status(201).json({message: "Successfully saved this song", ok:true, results: updatedlist})
  }catch(err){
    res.status(500).json({message: "Error saving song", ok:false})
  }
})
router.delete('/delete',authenticateToken, async (req, res) => {
  try{
    const {songId, lat, lng} = req.query
    const userId = req.user.id
    await deleteSavedSong(songId, userId, Number(lat), Number(lng))
    const updatedlist = await getSavedSongsForUser(req.user.id)
    res.status(200).json({message: "Successfully deleted this song", ok:true, results: updatedlist})
  }catch(err){
    res.status(500).json({message: "Error deleting song", ok:false})
  }
})
export default router
