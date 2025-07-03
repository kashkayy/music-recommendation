import express from 'express'
import { searchResults } from '../controllers.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
const router = express.Router()
router.get('/', authenticateToken, async (req, res) => {
  try{
    const {query} = req.query
    const results = await searchResults(query)
    res.status(200).json({message: "Success", results: results, ok:true})
  }catch(err){
    res.status(500).json({message: "Error getting search results", ok:false})
  }
})
export default router
