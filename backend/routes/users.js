import express from 'express';
import {db} from '../firebase.mjs';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  const { username, email } = req.body;
  try {
    const docRef = await db.collection('users').add({ username, email });
    res.status(201).json({ id: docRef.id, username, email });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;