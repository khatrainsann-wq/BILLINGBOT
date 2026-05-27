module.exports = {
  apps: [
    {
      name: 'billing-bot',
      script: './src/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
