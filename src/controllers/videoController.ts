import { Request, Response, NextFunction } from 'express';
import { processVideo } from '../utils/ffmpeg';
import { AppError } from '../middleware/errorHandler';
import path from 'path';

export const processVideoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError('No video file uploaded', 400);
    }

    const inputPath = req.file.path;
    const outputPath = path.join('tmp/processed', `processed-${Date.now()}.mp4`);
    
    const { logoPath, logoPosition, effects } = req.body;

    const processedVideoPath = await processVideo({
      inputPath,
      outputPath,
      logoPath,
      logoPosition: logoPosition ? JSON.parse(logoPosition) : undefined,
      effects: effects ? JSON.parse(effects) : undefined,
    });

    res.json({
      status: 'success',
      data: {
        processedVideoPath,
      },
    });
  } catch (error) {
    next(error);
  }
};