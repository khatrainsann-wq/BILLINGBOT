require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'billing-bot',
      script: './src/index.js',
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'production',
        TOKEN: process.env.TOKEN || '',
        MONGO_URI: process.env.MONGO_URI || '',
        CLIENT_ID: process.env.CLIENT_ID || '',
        GUILD_ID: process.env.GUILD_ID || '',
        BOT_STATUS: process.env.BOT_STATUS || 'idle'
      }
    }
  ]
};
