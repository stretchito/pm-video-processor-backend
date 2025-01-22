import { Request, Response, NextFunction } from 'express';
import { VideoProcessor } from '../components/video-processing/VideoProcessor';
import { AppError } from '../middleware/errorHandler';

export class VideoController {
  private videoProcessor: VideoProcessor;

  constructor(videoProcessor?: VideoProcessor) {
    // Allow dependency injection for testing, or create new instance
    this.videoProcessor = videoProcessor || new VideoProcessor();
  }

  public async processVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { inputPath, outputPath, quality } = req.body;

      if (!inputPath || !outputPath) {
        throw new AppError('Input and output paths are required', 400);
      }

      await this.videoProcessor.process({
        inputPath,
        outputPath,
        quality: quality || 100
      });

      res.status(200).json({
        status: 'success',
        message: 'Video processed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}