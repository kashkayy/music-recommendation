import express from 'express'
import { searchResults } from '../PrismaClient.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
const router = express.Router()
router.get('/', async (req, res) => {
  try{
    const {query} = req.query
    const results = await searchResults(query)
    res.status(200).json({message: "Success", results: results, ok:true})
  }catch(err){
    res.status(500).json({message: "Error getting search results", ok:false})
    console.log(err)
  }
})
export default router
