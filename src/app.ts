import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes';
import metricsRoutes from './routes/metricsRoutes';
import { errorHandler } from './middleware/errorHandler';
import { initializeMetrics } from './utils/metrics';

// Load environment variables
dotenv.config();

// Initialize metrics
initializeMetrics();

const app = express();
const port = Number(process.env.PORT) || 10000;

// Enhanced startup logging
console.log('Starting application with configuration:');
console.log(`Node Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);
console.log(`Current working directory: ${process.cwd()}`);

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid JSON payload',
      error: err.message 
    });
  }
  next(err);
});

// Enhanced health check endpoint
app.get('/', (_req, res) => {
  const health = {
    status: 'ok',
    service: 'video-processor-api',
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid
  };
  
  res.status(200).json(health);
});

// Routes
app.use('/api/videos', videoRoutes);
app.use('/metrics', metricsRoutes);

// Error handling middleware
app.use(errorHandler);

// Enhanced server startup
const server = app.listen(port, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`Server Details:`);
  console.log(`- Status: Running`);
  console.log(`- Port: ${port}`);
  console.log(`- Environment: ${process.env.NODE_ENV}`);
  console.log(`- Process ID: ${process.pid}`);
  console.log(`- Memory Usage: ${JSON.stringify(process.memoryUsage(), null, 2)}`);
  console.log('='.repeat(50));
}).on('error', (error) => {
  console.error('='.repeat(50));
  console.error('Server Failed to Start');
  console.error('-'.repeat(20));
  console.error('Error Details:');
  console.error(`- Message: ${error.message}`);
  console.error(`- Code: ${error.code}`);
  console.error(`- Port: ${port}`);
  console.error(`- Environment: ${process.env.NODE_ENV}`);
  console.error('-'.repeat(20));
  console.error('Stack Trace:');
  console.error(error.stack);
  console.error('='.repeat(50));
  process.exit(1);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    
    // Perform any cleanup here
    console.log('Cleaning up resources...');
    
    console.log('Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:');
  console.error(error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;