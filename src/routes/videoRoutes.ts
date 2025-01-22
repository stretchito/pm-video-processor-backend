import { Router } from 'express';
import { VideoController } from '../controllers/videoController';

const router = Router();
const videoController = new VideoController();

router.post('/process', (req, res, next) => 
  videoController.processVideo(req, res, next)
);

export default router;