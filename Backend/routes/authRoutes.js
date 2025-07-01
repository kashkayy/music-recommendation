import express from 'express'
import {createUser, login} from '../controllers.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()
router.post('/signup', async (req, res) => {
  const {username, password} = req.body
  try {
    const newUser = await createUser(username, password);
      res.status(201).json({ message: "User created successfully", data: newUser, ok: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user", error: error.message, ok: false});
    }
})
router.post('/login', async (req,res) => {
  const {username, password} = req.body
  try{
    const user = await login(username, password)
    if(!user){
      res.status(401).json({message: "Incorrect username or password :(", ok: false})
    }else{
      const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
      res.status(201).json({ message: "Log in successful!", token: accessToken, ok: true});
    }
  }catch(error){
    res.status(500).json({ message: "Log in failed", error: error.message, ok: false });
  }
})
export default router
