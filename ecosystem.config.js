module.exports = {
  apps: [
    {
      name: "Autoservice",
      script: "dist/main.js",
      // script: 'pnpm',
      // args: 'run start:prod',
      // cwd: '/var/www/autoservice',
      // interpreter: "/home/ubuntu/.local/share/pnpm/node",
      // watch: '.',
      watch: false,
      ignore_watch: ["[\/\\]\./", "node modules", "logs"],
      max_size: "10M", // Tamanho máximo do log (pode ser em MB, KB ou GB)
      retain: "2", // Número de arquivos antigos a manter
      log_date_format: "YYYY-MM-DD HH:mm Z",
      autorestart: true,
      // env: {
      //   NODE_ENV: "production",
      // },
      env_file: "/home/ubuntu/.env_prod",
    },
  ],
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
