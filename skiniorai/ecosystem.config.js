module.exports = {
  apps: [
    {
      name: 'skiniorai',
      cwd: '/Users/al-husseinabdullah/Desktop/skinior/skiniorai',
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
    {
      // PM2 entry for local development (runs `npm run dev`)
      name: 'skiniorai-dev',
      cwd: '/Users/al-husseinabdullah/Desktop/skinior/skiniorai',
      script: 'npm',
      args: 'run dev',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
  ],
};