import express from 'express';
import {checkRole, authenticateToken } from '../middleware/authMiddleware.js';
import { getAllSongs, getSongById, getAllUsers, getUserById, getTopTrendingSongs, getTopUsers, toggleAdmin, toggleBan } from '../controllers.js';
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
router.get('/top/songs', authenticateToken, checkRole(Role.admin), async (req, res) => {
    try{
        const trending = await getTopTrendingSongs()
        res.status(200).json({message: "Successfully fetched top 10", results: trending, ok: true})
    }catch(err){
        res.status(500).json({message: "Error fetching top 10 trending songs", ok: false})
    }
})
router.get('/top/users', authenticateToken, checkRole(Role.admin), async (req, res) => {
    try{
        const users = await getTopUsers()
        res.status(200).json({message: "Successfully fetched top users", results: users, ok: true})
    }catch(err){
        res.status(500).json({message: "Error fetching top users", ok: false})
    }
})
router.put('/:userId/role-action', authenticateToken, checkRole(Role.admin), async (req, res) => {
    const {userId} = req.params
    try{
        await toggleAdmin(userId)
        const updated = await getAllUsers()
        res.status(200).json({message: "Successfully changed role", results: updated, ok: true})
    }catch(err){
        res.status(500).json({message: "Cannot perform action at this time", ok: false})
    }
})
router.put('/:userId/ban-action', authenticateToken, checkRole(Role.admin), async (req, res) => {
    const {userId} = req.params
    try{
        await toggleBan(userId)
        const updated = await getAllUsers()
        res.status(200).json({message: "Successfully changed status", results: updated, ok: true})
    }catch(err){
        res.status(500).json({message: "Cannot perform action at this time", ok: false})
    }
})
export default router;
