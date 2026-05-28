#!/bin/bash
# PM2 Management Script for Billing Bot

case "$1" in
  "start")
    echo "Starting billing-bot..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 status
    ;;
  "stop")
    echo "Stopping billing-bot..."
    pm2 stop billing-bot
    ;;
  "restart")
    echo "Restarting billing-bot..."
    pm2 restart billing-bot
    sleep 2
    pm2 status
    ;;
  "logs")
    pm2 logs billing-bot --lines 100 --nostream
    ;;
  "logs-live")
    pm2 logs billing-bot
    ;;
  "status")
    pm2 status
    ;;
  "save")
    pm2 save
    echo "PM2 configuration saved"
    ;;
  "delete")
    echo "Removing billing-bot from PM2..."
    pm2 delete billing-bot
    pm2 save
    ;;
  "reset")
    echo "Resetting bot (deleting and restarting)..."
    pm2 delete billing-bot 2>/dev/null || true
    sleep 1
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|logs-live|status|save|delete|reset}"
    exit 1
    ;;
esac
