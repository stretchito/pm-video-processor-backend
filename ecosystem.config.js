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
    error_file: 'logs/error.log',
    out_file: 'logs/output.log',
    log_file: 'logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    node_args: [
      '--experimental-modules',
      '--es-module-specifier-resolution=node'
    ],
    source_map_support: true,
    merge_logs: true,
    log_type: 'json'
  }]
};