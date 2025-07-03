import express from 'express';
import {checkRole, authenticateToken } from '../middleware/authMiddleware.js';
import { getAllSongs, getSongById, getAllUsers, getUserById } from '../controllers.js';
const router = express.Router();
router.get('/', authenticateToken, (req, res) => {
    res.json({isAdmin: req.user.role === 'admin', ok:true})
})
router.get('/users', authenticateToken, checkRole('admin'), async (req, res) => {
    const userRole = req.user.role
    try{
        const users = await getAllUsers(userRole)
        res.status(200).json({message: "Users fetched successfully", results: users, ok:true})
    }catch(err){
        res.status(500).json({message: "Error fetching users", ok:false})
    }
})
export default router;
