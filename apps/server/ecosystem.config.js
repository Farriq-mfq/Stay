// solution : https://juejin.cn/post/7357288361236234281
module.exports = {
  apps: [
    {
      name: 'server-presensi',
      script: 'dist/src/main.js',
      // instances: 'max',
      // exec_mode: 'cluster',
      // watch: false,
      // max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
