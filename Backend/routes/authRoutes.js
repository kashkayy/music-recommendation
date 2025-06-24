import express from 'express'
import {createUser, login} from '../PrismaClient.js'
const router = express.Router()
router.post('/signup', async (req, res) => {
  const {username, password} = req.body
  try {
      const newUser = await createUser(username, password);
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user", error: error.message });
    }
})
router.post('/login', async (req,res) => {
  const {username, password} = req.body
  try{
    const user = await login(username, password)
    if(!user){
      res.status(401).json({message: "Incorrect username or password :("})
    }
    res.status(201).json({ message: "Log in successful!"});
  }catch(error){
    res.status(500).json({ message: "Log in failed", error: error.message });
  }
})
export default router