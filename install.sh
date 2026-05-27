#!/usr/bin/env bash
set -e

echo "Starting BillingBot installer..."

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root to allow package installation (sudo).";
  exit 1
fi

apt update && apt upgrade -y

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js LTS..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt install -y nodejs
fi

if ! command -v npm >/dev/null 2>&1; then
  apt install -y npm
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "Installing project dependencies..."
npm install

read -p "Bot Token: " TOKEN
read -p "Client ID: " CLIENT_ID
read -p "MongoDB URI: " MONGO_URI
read -p "Guild ID (optional): " GUILD_ID
read -p "Bot presence/status (e.g. 'Billing Service'): " BOT_STATUS

cat > .env <<EOL
TOKEN=${TOKEN}
CLIENT_ID=${CLIENT_ID}
MONGO_URI=${MONGO_URI}
GUILD_ID=${GUILD_ID}
BOT_STATUS=${BOT_STATUS}
EOL

echo "Registering slash commands (global). This may take a minute..."
node register-commands.js || true

echo "Starting bot with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "Installation complete. Use 'pm2 logs' to view logs." 
