module.exports = {
  apps: [{
    script: 'dist/main.js',
    watch: '.',
    ignore_watch: ["[\/\\]\./", "node modules", "logs"],
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_producttion: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '107.22.156.206',
      ref: 'origin/master',
      repo: 'git@github.com:hardlevel/autoservice.git',
      fetch: 'all',
      path: '/var/www/autoservice',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'

    }
  }
};
