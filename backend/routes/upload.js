import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
  cloud_name: 'dslkkcdnw',
  api_key:    '779326328141677',
  api_secret: 'YJC9uk0xN10vtb1_Lr_8CNI7nos'
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'chat_images' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ imageUrl: result.secure_url });
      }
    );

    // Pipe the buffer to Cloudinary's upload stream
    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (err) {
    res.status(500).json({ error: 'Upload failed.' });
  }
});

export default router;