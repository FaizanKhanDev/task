module.exports = {
    apps: [
      {
        name: 'server',           
        script: 'npm',            
        args: 'run dev',           
        instances: 1,            
        exec_mode: 'fork',       
        env: {
          NODE_ENV: 'development',
          PORT: 5000,
        },
        env_production: {
          NODE_ENV: 'production',  
          PORT: 5000,
        },
        log_file: './logs/combined.log',
        error_file: './logs/error.log', 
        out_file: './logs/out.log',      
        merge_logs: true,               
        autorestart: true,              
        watch: false,                   
        max_memory_restart: '1G',         
      },
    ],
  };
  