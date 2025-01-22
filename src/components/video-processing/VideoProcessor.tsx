import { ErrorHandler } from '../../middleware/errorHandler';

export class VideoProcessingError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'VideoProcessingError';
  }
}

export class VideoProcessor {
  private async handleProcessingError(error: any): Promise<void> {
    console.error('Video processing error:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      timestamp: new Date().toISOString()
    });

    // Add any cleanup logic here
    // For example, deleting temporary files
    
    throw new VideoProcessingError(
      'Failed to process video',
      { originalError: error.message }
    );
  }

  // Wrap your existing video processing methods with this error handler
  async process(/* your existing parameters */): Promise<void> {
    try {
      // Your existing video processing logic
    } catch (error) {
      await this.handleProcessingError(error);
    }
  }
}