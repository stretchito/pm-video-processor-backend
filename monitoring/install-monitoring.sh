#!/bin/bash

# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*/
sudo mv prometheus /usr/local/bin/
sudo mv promtool /usr/local/bin/
sudo mkdir /etc/prometheus
sudo mv consoles/ /etc/prometheus/
sudo mv console_libraries/ /etc/prometheus/
cd ..
rm -rf prometheus-*

# Install Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-*.tar.gz
cd node_exporter-*/
sudo mv node_exporter /usr/local/bin/
cd ..
rm -rf node_exporter-*

# Install Alertmanager
wget https://github.com/prometheus/alertmanager/releases/download/v0.25.0/alertmanager-0.25.0.linux-amd64.tar.gz
tar xvfz alertmanager-*.tar.gz
cd alertmanager-*/
sudo mv alertmanager /usr/local/bin/
sudo mv amtool /usr/local/bin/
cd ..
rm -rf alertmanager-*

# Install Grafana
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install -y grafana

# Create users
sudo useradd --no-create-home --shell /bin/false prometheus
sudo useradd --no-create-home --shell /bin/false node_exporter
sudo useradd --no-create-home --shell /bin/false alertmanager

# Create directories
sudo mkdir -p /etc/prometheus
sudo mkdir -p /var/lib/prometheus
sudo mkdir -p /etc/alertmanager

# Set ownership
sudo chown prometheus:prometheus /etc/prometheus
sudo chown prometheus:prometheus /var/lib/prometheus
sudo chown alertmanager:alertmanager /etc/alertmanager

# Copy configuration files
sudo cp prometheus.yml /etc/prometheus/
sudo cp alert.rules.yml /etc/prometheus/
sudo cp alertmanager.yml /etc/alertmanager/
sudo cp node-exporter.service /etc/systemd/system/

# Set permissions
sudo chown prometheus:prometheus /etc/prometheus/prometheus.yml
sudo chown prometheus:prometheus /etc/prometheus/alert.rules.yml
sudo chown alertmanager:alertmanager /etc/alertmanager/alertmanager.yml

# Start services
sudo systemctl daemon-reload
sudo systemctl start prometheus
sudo systemctl enable prometheus
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
sudo systemctl start alertmanager
sudo systemctl enable alertmanager
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Install required Node.js packages for metrics
npm install prom-client winston

echo "Monitoring setup complete!"