import express from 'express'
import { getLocations } from '../PrismaClient.js';
const router = express.Router()
router.get('/', async (req, res) => {
  try{
    const locations = await getLocations();
    res.json({results: locations})
  } catch (err){
    res.status(500).json({message: 'Failed to fetch locations'})
  } 
})
export default router