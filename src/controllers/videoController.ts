import { Request, Response, NextFunction } from 'express';
import { processVideo } from '../utils/ffmpeg';
import { VideoProcessingRequest, ProcessingOptions } from './video/types';
import { logger } from './video/logger';
import { uploadToSupabase } from './video/storage';
import { cleanupFiles } from './video/cleanup';
import { validateVideoRequest } from './video/validation';
import { 
  videoProcessingDuration,
  processingErrors as videoProcessingErrors,
  activeProcessingJobs,
  storageUsage
} from '../utils/metrics';

export const processVideoHandler = async (
  req: VideoProcessingRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  let inputPath: string | undefined;
  let processedVideoPath: string | undefined;

  try {
    activeProcessingJobs.inc();
    logger.info('Starting video processing request', {
      headers: req.headers,
      body: req.body,
      file: req.file
    });

    const { filePath, fileSize } = validateVideoRequest(req);
    inputPath = filePath;

    const outputPath = `tmp/processed/processed-${Date.now()}.mp4`;
    const options: ProcessingOptions = {
      logoPath: req.body.logoPath,
      logoPosition: req.body.logoPosition ? JSON.parse(req.body.logoPosition) : undefined,
      effects: req.body.effects ? JSON.parse(req.body.effects) : undefined,
    };

    logger.info('Processing video with options', {
      ...options,
      inputPath,
      outputPath
    });

    processedVideoPath = await processVideo({
      inputPath,
      outputPath,
      ...options
    });

    logger.info('Video processed successfully, uploading to Supabase');

    const { publicUrl, fileName } = await uploadToSupabase(processedVideoPath);
    storageUsage.set(fileSize);

    const duration = (Date.now() - startTime) / 1000;
    videoProcessingDuration.observe(duration);

    logger.info('Upload successful, cleaning up temporary files');
    cleanupFiles([inputPath, processedVideoPath].filter(Boolean) as string[]);

    res.json({
      status: 'success',
      data: {
        processedVideoPath: publicUrl,
        fileName,
      },
    });
  } catch (error) {
    logger.error('Error in video processing', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      inputPath,
      processedVideoPath
    });

    videoProcessingErrors.inc({ error_type: 'processing_error' });
    cleanupFiles([inputPath, processedVideoPath].filter(Boolean) as string[]);
    next(error);
  } finally {
    activeProcessingJobs.dec();
  }
};