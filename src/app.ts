import express from 'express';
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
app.get('/', (_req, res) => {
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment PORT value: ${process.env.PORT}`);
  console.log(`Server is listening on all interfaces (0.0.0.0:${port})`);
});

export default app;