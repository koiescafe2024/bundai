module.exports = {
    apps : [{
      name: 'dotbet-bundai',
      script: 'npm',
      args: 'run dev',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      interpreter: '/bin/bash',
      env: {
        NODE_ENV: 'development',
      },
    }],
  };
  