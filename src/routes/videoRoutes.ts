import { Router, Request, Response, NextFunction } from 'express';
import { VideoController } from '../controllers/videoController';

// Define the expected request body structure
interface ProcessVideoRequest extends Request {
  body: {
    inputPath: string;
    outputPath: string;
    quality?: number;
  }
}

// Initialize router and controller
const router = Router();
const videoController = new VideoController();

// Process video route
router.post(
  '/process', 
  async (req: ProcessVideoRequest, res: Response, next: NextFunction) => {
    await videoController.processVideo(req, res, next);
  }
);

// Health check route
router.get(
  '/health', 
  (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Video processing service is healthy'
    });
  }
);

export default router;