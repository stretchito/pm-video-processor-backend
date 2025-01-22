import { Router } from 'express';
import { VideoController } from '../controllers/videoController';

const router = Router();
const videoController = new VideoController();

// Process video route
router.post('/process', (req, res, next) => 
  videoController.processVideo(req, res, next)
);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Video processing service is healthy'
  });
});

export default router;