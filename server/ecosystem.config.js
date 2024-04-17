module.exports = {
  apps: [
    {
      name: "webserver",
      script: "./index.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      instances: 4,
      listen_timeout : 8000,
      max_restarts : 15,
      restart_delay : 300,
    },
  ],
 }
