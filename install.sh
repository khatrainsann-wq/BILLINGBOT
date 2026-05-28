#!/usr/bin/env bash
set -e

echo "Starting BillingBot installer..."

# Resolve repo directory (script's directory)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Determine non-root user to own the app (when using sudo)
if [ -n "$SUDO_USER" ] && [ "$SUDO_USER" != "root" ]; then
  RUN_USER="$SUDO_USER"
else
  RUN_USER="$(whoami)"
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

echo "Installing project dependencies as $RUN_USER..."
if [ "$RUN_USER" = "root" ]; then
  (cd "$REPO_DIR" && npm install)
else
  su - "$RUN_USER" -c "cd '$REPO_DIR' && npm install"
fi

read -p "Bot Token: " TOKEN
read -p "Client ID: " CLIENT_ID
read -p "MongoDB URI: " MONGO_URI
read -p "Guild ID (optional): " GUILD_ID
read -p "Bot presence/status (e.g. 'Billing Service'): " BOT_STATUS

cat > "$REPO_DIR/.env" <<EOL
TOKEN=${TOKEN}
CLIENT_ID=${CLIENT_ID}
MONGO_URI=${MONGO_URI}
GUILD_ID=${GUILD_ID}
BOT_STATUS=${BOT_STATUS}
EOL

echo "Registering slash commands (global). This may take a minute..."
cd "$REPO_DIR"
node register-commands.js || true

echo "Starting bot with PM2 (managed as $RUN_USER)..."
if [ "$RUN_USER" = "root" ]; then
  pm2 start ecosystem.config.js --env production
else
  su - "$RUN_USER" -c "cd '$REPO_DIR' && pm2 start ecosystem.config.js --env production"
fi

pm2 save

# Configure PM2 to start on system boot for the app user
echo "Configuring PM2 startup for user $RUN_USER..."
pm2 startup systemd -u "$RUN_USER" --hp "/home/$RUN_USER" || true

echo "Installation complete. Use 'pm2 logs billing-bot' to view logs." 
