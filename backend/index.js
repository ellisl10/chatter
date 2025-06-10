import express from 'express';
import cors from 'cors';
import functions from 'firebase-functions';

import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import uploadRoute from './routes/upload.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoute);

export const api = functions.https.onRequest(app);