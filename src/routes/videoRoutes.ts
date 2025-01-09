import { Router } from 'express';
import multer from 'multer';
import { processVideoHandler } from '../controllers/videoController';

const router = Router();

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: 'tmp/uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.mp4');
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  }
});

router.post('/process', upload.single('video'), processVideoHandler);

export default router;