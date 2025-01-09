#!/bin/bash

# Exit on any error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%dT%H:%M:%S%z')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%dT%H:%M:%S%z')] ERROR: $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%dT%H:%M:%S%z')] WARNING: $1${NC}"
}

# Check required environment variables
check_env_vars() {
    local required_vars=("DROPLET_NAME" "DOMAIN_NAME" "SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -ne 0 ]]; then
        error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
}

# Update system and install basic tools
setup_base_system() {
    log "Updating system packages..."
    sudo apt-get update
    sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

    log "Installing basic tools..."
    sudo apt-get install -y \
        curl \
        wget \
        git \
        htop \
        ufw \
        fail2ban
}

# Install and configure Node.js
setup_nodejs() {
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    log "Installing PM2..."
    sudo npm install -g pm2
}

# Install and configure FFmpeg
setup_ffmpeg() {
    log "Installing FFmpeg..."
    sudo apt-get install -y ffmpeg
}

# Install and configure Nginx
setup_nginx() {
    log "Installing and configuring Nginx..."
    sudo apt-get install -y nginx

    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/video-processor <<EOF
server {
    listen 80;
    server_name ${DOMAIN_NAME};

    location / {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Increase timeout for video processing
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
EOF

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/video-processor /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default

    # Test and reload Nginx
    sudo nginx -t
    sudo systemctl reload nginx
}

# Setup SSL with Certbot
setup_ssl() {
    log "Setting up SSL with Certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d "${DOMAIN_NAME}" --non-interactive --agree-tos --email "${ADMIN_EMAIL}"
}

# Configure firewall
setup_firewall() {
    log "Configuring firewall..."
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw --force enable
}

# Setup application environment
setup_application() {
    log "Setting up application environment..."
    
    # Create application directory
    sudo mkdir -p /var/www/video-processor
    sudo chown -R $USER:$USER /var/www/video-processor

    # Setup environment variables
    sudo tee /var/www/video-processor/.env <<EOF
PORT=10000
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
NODE_ENV=production
EOF

    # Setup PM2 ecosystem file
    sudo tee /var/www/video-processor/ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'video-processor',
    script: 'dist/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Install monitoring tools
    sudo apt-get install -y prometheus-node-exporter

    # Setup log rotation
    sudo tee /etc/logrotate.d/video-processor <<EOF
/var/www/video-processor/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
}

# Main execution
main() {
    log "Starting server setup..."
    
    check_env_vars
    setup_base_system
    setup_nodejs
    setup_ffmpeg
    setup_nginx
    setup_ssl
    setup_firewall
    setup_application
    setup_monitoring

    log "Server setup completed successfully!"
}

# Run main function
main