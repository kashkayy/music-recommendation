import express from 'express'
import {createSavedSong, getSavedSongsForUser } from '../controllers.js'
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
router.post('/',authenticateToken, async (req, res) => {
  const {songId, lat, lng} = req.body
  if(!lat || !lng){
    return res.json({mesage: "Allow Sound Map access your location"})
  }
  try{
    await createSavedSong(req.user.id, songId, lat, lng)
    const updatedlist = await getSavedSongsForUser(req.user.id)
    res.status(201).json({message: "Successfully saved this song", ok:true, results: updatedlist})
  }catch(err){
    res.status(500).json({message: "Error saving song", ok:false})
  }
})
export default router
