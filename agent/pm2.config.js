module.exports = {
  apps: [
    {
      name: 'agent16-dev',
      script: 'agent16/venv/bin/python',
      args: 'agent16/main.py dev',
      cwd: '/home/husain/skinior/agent',
      interpreter: 'none',
      env: {
        LIVEKIT_AGENT_PORT: '8001'
      },
      restart_delay: 1000,
      max_restarts: 5,
      min_uptime: '10s'
    },
    {
      name: 'agent16-prod',
      script: 'agent16/venv/bin/python',
      args: 'agent16/main.py start',
      cwd: '/home/husain/skinior/agent',
      interpreter: 'none',
      env: {
        LIVEKIT_AGENT_PORT: '8002'
      },
      restart_delay: 1000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
