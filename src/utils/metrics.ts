import { Counter, Gauge, Histogram } from 'prom-client';
import client from 'prom-client';

// Enable default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Video processing metrics
export const videoProcessingDuration = new Histogram({
  name: 'video_processing_duration_seconds',
  help: 'Duration of video processing in seconds',
  buckets: [10, 30, 60, 120, 300, 600],
});

export const videoProcessingErrors = new Counter({
  name: 'video_processing_errors_total',
  help: 'Total number of video processing errors',
  labelNames: ['error_type'],
});

export const activeProcessingJobs = new Gauge({
  name: 'active_processing_jobs',
  help: 'Number of currently active video processing jobs',
});

export const storageUsage = new Gauge({
  name: 'storage_usage_bytes',
  help: 'Total storage usage in bytes',
});

// Initialize metrics
export const initializeMetrics = () => {
  videoProcessingErrors.reset();
  activeProcessingJobs.set(0);
};

// Update storage usage
export const updateStorageUsage = async (bytes: number) => {
  storageUsage.set(bytes);
};