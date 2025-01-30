import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeMetrics } from './utils/metrics.js';

dotenv.config();

// Initialize metrics
initializeMetrics();

const app = express();
const port = Number(process.env.PORT) || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'video-processor-api',
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/videos', videoRoutes);
app.use('/metrics', metricsRoutes);

// Error handling middleware
app.use(errorHandler);

// Listen on all network interfaces
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment PORT value: ${process.env.PORT}`);
  console.log(`Server is listening on all interfaces (0.0.0.0:${port})`);
}).on('error', (error: Error) => {
  console.error('Failed to start server:', error);
  console.error('Port:', port);
  console.error('Environment:', process.env.NODE_ENV);
  console.error('Full error:', JSON.stringify(error, null, 2));
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;