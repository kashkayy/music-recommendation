import express from 'express'
import {createUser} from '../PrismaClient.js'
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
export default router