import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

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

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    // Apply effects if specified
    if (effects) {
      const filters: string[] = [];
      
      if (effects.brightness !== undefined) {
        filters.push(`brightness=${effects.brightness}`);
      }
      
      if (effects.contrast !== undefined) {
        filters.push(`contrast=${effects.contrast}`);
      }
      
      if (effects.saturation !== undefined) {
        filters.push(`saturation=${effects.saturation}`);
      }
      
      if (effects.zoom !== undefined) {
        filters.push(`scale=iw*${effects.zoom}:ih*${effects.zoom}`);
      }

      if (filters.length > 0) {
        command = command.videoFilters(filters);
      }
    }

    // Add logo if specified
    if (logoPath && logoPosition) {
      command = command.input(logoPath)
        .complexFilter([
          `overlay=${logoPosition.x}:${logoPosition.y}`
        ]);
    }

    command
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .save(outputPath);
  });
};