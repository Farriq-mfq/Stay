module.exports = {
    apps: [
        {
            name: 'Stay',
            script: 'pnpm',
            args: 'start',
            // cwd: '.',
            watch: true,
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
