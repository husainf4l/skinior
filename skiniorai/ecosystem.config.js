module.exports = {
  apps: [
    {
      name: 'skiniorai',
      cwd: '/home/husain/skinior/skiniorai',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
    },
  ],
};