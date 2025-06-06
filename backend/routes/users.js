import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create a new user
router.post('/', async (req, res) => {
  const { username, email } = req.body;
  const newUser = await prisma.user.create({
    data: { username, email },
  });
  res.status(201).json(newUser);
});

export default router;