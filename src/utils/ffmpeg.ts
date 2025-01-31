import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

interface VideoProcessingOptions {
  inputPath: string;
  outputPath: string;
  logoPath?: string;
  logoPosition?: {
    x: number;
    y: number;
    size: number;
    rotation: number;
  };
  effects?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    zoom?: number;
  };
}

export const processVideo = async (options: VideoProcessingOptions): Promise<string> => {
  const {
    inputPath,
    outputPath,
    logoPath,
    logoPosition,
    effects,
  } = options;

  logger.info('Starting video processing with options:', {
    inputPath,
    outputPath,
    logoPosition,
    effects
  });

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .outputOptions([
        '-max_muxing_queue_size 1024',
        '-y',
        '-preset ultrafast',
        '-movflags +faststart',
        '-maxrate 1M',
        '-bufsize 2M',
        '-threads 1',
        '-vf scale=w=min(1280\\,iw):h=min(720\\,ih):force_original_aspect_ratio=decrease',
        '-crf 28',
      ]);

    if (effects) {
      const filters: string[] = [];
      
      if (effects.brightness !== undefined) {
        const normalizedBrightness = effects.brightness / 100;
        logger.info('Applying brightness effect:', normalizedBrightness);
        filters.push(`eq=brightness=${normalizedBrightness}`);
      }
      
      if (effects.contrast !== undefined) {
        const normalizedContrast = effects.contrast / 100;
        logger.info('Applying contrast effect:', normalizedContrast);
        filters.push(`eq=contrast=${normalizedContrast}`);
      }
      
      if (effects.saturation !== undefined) {
        const normalizedSaturation = effects.saturation / 100;
        logger.info('Applying saturation effect:', normalizedSaturation);
        filters.push(`eq=saturation=${normalizedSaturation}`);
      }
      
      if (effects.zoom !== undefined && effects.zoom !== 100) {
        const scale = effects.zoom / 100;
        logger.info('Applying zoom effect:', scale);
        filters.push(`scale=iw*${scale}:ih*${scale}`);
      }

      if (filters.length > 0) {
        command = command.videoFilters(filters);
      }
    }

    if (logoPath && logoPosition) {
      logger.info('Adding logo with position:', logoPosition);
      command = command.input(logoPath)
        .complexFilter([
          `overlay=${logoPosition.x}:${logoPosition.y}`
        ]);
    }

    command
      .on('start', (commandLine) => {
        logger.info('FFmpeg processing started:', commandLine);
      })
      .on('progress', (progress) => {
        logger.info('Processing progress:', progress);
      })
      .on('end', () => {
        logger.info('FFmpeg processing completed');
        resolve(outputPath);
      })
      .on('error', (err) => {
        logger.error('FFmpeg error:', {
          error: err,
          message: err.message,
          stack: err.stack,
          inputPath,
          outputPath
        });
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .save(outputPath);
  });
};