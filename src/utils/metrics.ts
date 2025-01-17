import { Counter, Gauge, Histogram } from 'prom-client';
import client from 'prom-client';

// Enable default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Video processing metrics
export const videoProcessingDuration = new Histogram({
  name: 'video_processing_duration_seconds',
  help: 'Duration of video processing in seconds',
  labelNames: ['status']
});

export const activeProcessingJobs = new Gauge({
  name: 'active_processing_jobs',
  help: 'Number of currently active video processing jobs'
});

export const totalProcessedVideos = new Counter({
  name: 'total_processed_videos',
  help: 'Total number of videos processed'
});

export const processingErrors = new Counter({
  name: 'video_processing_errors_total',
  help: 'Total number of video processing errors'
});