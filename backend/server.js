import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import uploadRoute from './routes/upload.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoute);
app.listen(4000, () => {
  console.log('Backend running at http://localhost:4000');
});
