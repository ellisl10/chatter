import express from 'express';
import {db} from '../firebase.mjs';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  const { username, email, displayName, photoURL, bio } = req.body;
  try {
    const docRef = await db.collection('users').add({
      username,
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      bio: bio || '',
      createdAt: new Date()
    });
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

// Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { displayName, username, email } = req.body;
  try {
    // In a real application, you would verify the user's identity here
    // For now, we are directly updating based on ID received from frontend
    const userRef = db.collection('users').doc(id);
    await userRef.update({
      displayName,
      username,
      email,
      updatedAt: new Date()
    });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;