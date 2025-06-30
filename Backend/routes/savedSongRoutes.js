import express from 'express'
import {createSavedSong, getSavedSongsForUser } from '../PrismaClient.js'
const router = express.Router()
export default router
