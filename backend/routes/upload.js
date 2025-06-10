import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

const cloudinaryName = process.env.CLOUDINARY_NAME;
const cloudinaryKey = process.env.CLOUDINARY_KEY;
const cloudinarySecret = process.env.CLOUDINARY_SECRET;

dotenv.config();

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key:    cloudinaryKey,
  api_secret: cloudinarySecret
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/test', (req, res) => {
  console.log("🧪 /upload/test was hit");
  res.json({ ok: true });
});

router.post('/', upload.single('image'), async (req, res) => {
  console.log('[upload] Route hit');

  try {
    if (!req.file) {
      console.error('[upload] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('[upload] File received:', req.file.originalname);

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
          if (result) {
            console.log('[upload] Upload success:', result.secure_url);
            resolve(result);
          } else {
            console.error('[upload] Upload error:', error);
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('[upload] Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;