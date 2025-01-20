module.exports = {
  apps : [{
    name: "autoservice",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}