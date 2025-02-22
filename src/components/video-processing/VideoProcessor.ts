import { AppError } from '../../middleware/errorHandler';

export interface ProcessingOptions {
  inputPath: string;
  outputPath: string;
  quality?: number;
}

export interface ProcessingCallbacks {
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export class VideoProcessor {
  private callbacks: ProcessingCallbacks;

  constructor(callbacks: ProcessingCallbacks = {}) {
    this.callbacks = callbacks;
  }

  private validateQuality(quality: number): void {
    if (quality < 0 || quality > 100) {
      throw new AppError(`Invalid quality value: ${quality}. Must be between 0 and 100`, 400);
    }
  }

  public async process(options: ProcessingOptions): Promise<void> {
    try {
      // Validate input
      if (!options.inputPath) {
        throw new AppError('Input path is required', 400);
      }
      if (!options.outputPath) {
        throw new AppError('Output path is required', 400);
      }

      // Set default quality if not provided
      const quality = options.quality ?? 100;
      this.validateQuality(quality);

      // Convert quality to string only when needed for external APIs
      const qualityString = quality.toString();

      // Your video processing logic here
      console.log(`Processing video:
        Input: ${options.inputPath}
        Output: ${options.outputPath}
        Quality: ${qualityString}
      `);

      // Add your video processing implementation here
      
      // Notify completion if callback provided
      this.callbacks.onComplete?.();

    } catch (error) {
      // Notify error if callback provided
      if (this.callbacks.onError) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
      
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error instanceof Error ? error.message : 'Video processing failed',
        500
      );
    }
  }

  async cleanup(): Promise<void> {
    // Add cleanup logic here if needed
  }
}