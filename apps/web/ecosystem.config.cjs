module.exports = {
    apps: [
        {
            name: 'frontend-presensi',
            script: 'serve',
            env: {
                PM2_SERVE_PATH: './dist',
                PM2_SERVE_PORT: 8080,
                PM2_SERVE_SPA: 'true',
                NODE_ENV: 'production'
            }
        }
    ]
};
