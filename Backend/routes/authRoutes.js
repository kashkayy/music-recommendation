import express from 'express'
import {createUser, login} from '../PrismaClient.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()
export function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(!token) return res.status(401)
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if(error) return res.status(403)
    req.user = user
    next()
  })
}
router.post('/signup', async (req, res) => {
  const {username, password} = req.body
  try {  
    const newUser = await createUser(username, password);
      res.status(201).json({ message: "User created successfully", user: newUser, success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user", error: error.message, success: false});
    }
})
router.post('/login', async (req,res) => {
  const {username, password} = req.body
  try{
    const user = await login(username, password)
    if(!user){
      res.status(401).json({message: "Incorrect username or password :(", success: false})
    }else{
      const accessToken = jwt.sign(username, process.env.JWT_SECRET_KEY)
      res.status(201).json({ message: "Log in successful!", accessToken: accessToken, success: true});
    }
  }catch(error){
    res.status(500).json({ message: "Log in failed", error: error.message });
  }
})
export default router