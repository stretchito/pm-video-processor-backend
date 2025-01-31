import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { logger } from './logger';
import { AppError } from '../../middleware/errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const uploadToSupabase = async (filePath: string) => {
  const fileStream = fs.createReadStream(filePath);
  const fileName = `processed-${Date.now()}.mp4`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('videos')
    .upload(`processed/${fileName}`, fileStream, {
      contentType: 'video/mp4',
      upsert: false
    });

  if (uploadError) {
    logger.error('Supabase upload error', uploadError);
    throw new AppError('Failed to upload processed video: ' + uploadError.message, 500);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(`processed/${fileName}`);

  return { publicUrl, fileName };
};