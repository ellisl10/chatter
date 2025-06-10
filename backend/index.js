import express from 'express';
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
// import uploadRoute from './routes/upload.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
// app.use('/upload', uploadRoute);

export const api = onRequest(
  {
    secrets: ['CLOUDINARY_NAME', 'CLOUDINARY_KEY', 'CLOUDINARY_SECRET'],
    region: 'us-central1'
  },
  app
);