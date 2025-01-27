declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'production' | 'development';
            JWT_SECRET?: string
            JWT_REFRESH_SECRET?: string
            JWT_SECRET_SISWA?: string
            JWT_REFRESH_SECRET_SISWA?: string
            JWT_SECRET_PEGAWAI?: string
            JWT_REFRESH_SECRET_PEGAWAI?: string
            TELEGRAM_BOT_TOKEN?: string
            WHATSAPP_SERVER?: string
            WHATSAPP_SERVER_SECRETKEY?: string
            PORT?: string
        }
    }
}
export { }