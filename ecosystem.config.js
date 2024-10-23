module.exports = {
    apps: [
        {
            name: 'Stay',
            script: 'pnpm',
            args: 'start',
            watch: true,
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
