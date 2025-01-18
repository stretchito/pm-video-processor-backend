module.exports = {
  apps: [{
    name: "video-processor",
    script: "/var/www/html/dist/app.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 10000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 10000
    },
    error_file: "/var/www/html/logs/err.log",
    out_file: "/var/www/html/logs/out.log",
    log_file: "/var/www/html/logs/combined.log",
    time: true
  }]
};