module.exports = {
  apps: [{
    name: 'Autoservice',
    // script: 'dist/main.js',
    script: 'pnpm',
    args: 'run start:prod',
    cwd: '/var/www/autoservice',
    interpreter: "/home/ubuntu/.local/share/pnpm/nodejs/22.14.0/bin/node",
    watch: '.',
    ignore_watch: ["[\/\\]\./", "node modules", "logs"],
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN
    }
  }],
  // deploy: {
  //   production: {
  //     user: 'ubuntu',
  //     host: '107.22.156.206',
  //     ref: 'origin/master',
  //     repo: 'https://github.com/hardlevel/autoservice.git',
  //     fetch: 'all',
  //     path: '/var/www/autoservice',
  //     'post-deploy': 'pnpm install && pnpm run build && pm2 reload ecosystem.config.js --env production',
  //     env: {
  //       GITHUB_TOKEN: process.env.GITHUB_TOKEN
  //     }
  //   }
  // }
};