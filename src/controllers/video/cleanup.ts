import fs from 'fs';
import { logger } from './logger';

export const cleanupFiles = (files: string[]) => {
  files.forEach(file => {
    if (file && fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        logger.error('Error cleaning up file:', { file, error });
      }
    }
  });
};