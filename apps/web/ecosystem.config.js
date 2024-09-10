module.exports = {
    apps: [
        {
            name: "frontend-presensi",
            script: 'serve',
            env: {
                PM2_SERVER_PATH: './dist',
                PM2_SERVER_PORT: 8080,
                PM2_SERVER_SPA: true,
                NODE_ENV: 'production',
            }
        }
    ]
}