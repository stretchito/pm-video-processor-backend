import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the full error details
  logger.error('Error details:', {
    error: err,
    stack: err.stack
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    return;
  }

  // Handle FFmpeg specific errors
  if (err.message && err.message.includes('FFmpeg')) {
    const errorMessage = err.message.includes('SIGKILL') 
      ? 'Video processing failed due to memory limits. Please try with a smaller video file or contact support.'
      : 'Video processing failed. Please try with a different video file.';
    
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    res.status(400).json({
      status: 'error',
      message: 'File upload error',
      details: err.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};