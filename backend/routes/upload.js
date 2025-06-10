import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'dslkkcdnw',
  api_key:    '779326328141677',
  api_secret: 'YJC9uk0xN10vtb1_Lr_8CNI7nos'
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/test', (req, res) => {
  console.log("🧪 /upload/test was hit");
  res.json({ ok: true });
});

router.post('/upload', upload.single('image'), async (req, res) => {
  console.log("🟢 Upload route hit");

  if (!req.file) {
    console.error("🔴 No file received in request");
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'chat_images' },
      (error, result) => {
        if (error) {
          console.error('🔴 Cloudinary error:', error);
          return res.status(500).json({ error: error.message });
        }
        console.log("✅ Image uploaded to:", result.secure_url);
        res.json({ imageUrl: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('🔴 Upload route error:', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

export default router;