import express from 'express';
import { db } from '../firebase.mjs'; // or .js depending on your setup
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const router = express.Router();

// POST /api/messages - send a new message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const docRef = await addDoc(collection(db, 'messages'), {
      sender,
      receiver,
      text,
      timestamp: new Date()
    });

    res.status(201).json({ id: docRef.id, sender, receiver, text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages - get all messages
router.get('/', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'messages'));
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages/:user1/:user2 - get messages between two users
router.get('/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messagesRef = collection(db, 'messages');
    const snapshot = await getDocs(messagesRef);

    const messages = snapshot.docs
      .map(doc => doc.data())
      .filter(msg =>
        (msg.sender === user1 && msg.receiver === user2) ||
        (msg.sender === user2 && msg.receiver === user1)
      );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
