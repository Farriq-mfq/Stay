declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'production' | 'development';
            JWT_SECRET?: string
            JWT_REFRESH_SECRET?: string
            JWT_SECRET_SISWA?: string
            JWT_REFRESH_SECRET_SISWA?: string
            TELEGRAM_BOT_TOKEN?: string
            PORT?: number
        }
    }
}
export { }