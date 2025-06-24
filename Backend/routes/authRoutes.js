import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {createUser} from '../PrismaClient.js'
const router = express.Router()
router.post('/signup', (req, res) => {
  const {username, password} = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  console.log(hashedPassword)
  console.log(username, password)
})
router.post('/login', (req, res) => {})
export default router