module.exports = {
  apps: [{
    name: "video-processor",
    script: "dist/app.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    max_restarts: 3,  // Reduce max restarts to fail faster
    min_uptime: "10s", // Consider process stable if it stays up for 10s
    env: {
      NODE_ENV: "production",
      PORT: 10000,
      DEBUG: "*" // Enable verbose logging
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 10000,
      DEBUG: "*"
    },
    error_file: "/var/www/video-processor/logs/err.log",
    out_file: "/var/www/video-processor/logs/out.log",
    log_file: "/var/www/video-processor/logs/combined.log",
    merge_logs: true,
    time: true
  }]
};