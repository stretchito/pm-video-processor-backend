import { VideoProcessingRequest } from './types';
import { AppError } from '../../middleware/errorHandler';
import fs from 'fs';
import { logger } from './logger';

export const validateVideoRequest = (req: VideoProcessingRequest) => {
  if (!req.file) {
    logger.error('No video file uploaded');
    throw new AppError('No video file uploaded', 400);
  }

  const stats = fs.statSync(req.file.path);
  const fileSizeInMB = stats.size / (1024 * 1024);
  
  logger.info('File size check', { 
    fileSizeInMB,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype
  });

  if (fileSizeInMB > 25) {
    logger.error('File size exceeds limit', { fileSizeInMB });
    throw new AppError('File size exceeds 25MB limit', 400);
  }

  return { filePath: req.file.path, fileSize: stats.size };
};