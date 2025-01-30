module.exports = {
  apps: [{
    name: 'video-processor',
    script: './dist/app.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 10000
    },
    node_args: [
      '--experimental-specifier-resolution=node'
    ],
    error_file: 'logs/error.log',
    out_file: 'logs/output.log',
    log_file: 'logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Add ESM support
    interpreter: 'node',
    interpreter_args: '--require ts-node/register --experimental-modules'
  }]
};