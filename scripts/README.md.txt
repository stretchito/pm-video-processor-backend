# Deployment Scripts

## Prerequisites

Before running the setup script, you need to:

1. Create a DigitalOcean account
2. Add your SSH key to DigitalOcean
3. Create an API token in DigitalOcean
4. Have a domain name ready
5. Have your Supabase credentials ready

## Environment Variables

Create a `.env` file in the scripts directory with the following variables:

```bash
DROPLET_NAME=video-processor
DOMAIN_NAME=your-domain.com
ADMIN_EMAIL=your-email@example.com
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Running the Setup Script

1. Make the script executable:
```bash
chmod +x setup-droplet.sh
```

2. Source your environment variables:
```bash
source .env
```

3. Run the script:
```bash
./setup-droplet.sh
```

## What the Script Does

1. Updates the system
2. Installs required software (Node.js, FFmpeg, Nginx)
3. Configures Nginx as a reverse proxy
4. Sets up SSL with Let's Encrypt
5. Configures the firewall
6. Sets up the application environment
7. Configures monitoring and logging

## After Running the Script

1. Deploy your application code to `/var/www/video-processor`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the application: `pm2 start ecosystem.config.js`

## Monitoring

The script sets up:
- Node exporter for Prometheus metrics
- Log rotation for application logs
- PM2 for process monitoring