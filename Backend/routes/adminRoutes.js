import express from 'express';
import {checkRole, authenticateToken } from '../middleware/authMiddleware.js';
import { getAllSongs, getSongById, getAllUsers, getUserById } from '../controllers.js';
import { Role } from '../generated/prisma/index.js';
const router = express.Router();
router.get('/', authenticateToken, (req, res) => {
    res.json({isAdmin: req.user.role === Role.admin})
})
router.get('/users', authenticateToken, checkRole(Role.admin), async (req, res) => {
    try{
        const users = await getAllUsers()
        res.status(200).json({message: "Users fetched successfully", results: users, ok:true})
    }catch(err){
        res.status(500).json({message: "Error fetching users", ok:false})
    }
})
router.get('/songs', authenticateToken, checkRole(Role.admin), async(req, res) => {
    try{
        const songs = await getAllSongs()
        res.status(200).json({message: "Songs successfully fetched", results: songs, ok: true})
    }catch(err){
        res.status(500).json({message: "Error fetching all songs", ok: false})
    }
})
export default router;
