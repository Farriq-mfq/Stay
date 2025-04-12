export const config = {
    backend_host: `${import.meta.env.VITE_API_URL}`,
    // backend_ssl: true,
    backend_ssl: true,
    STORAGE_KEY: `${import.meta.env.VITE_STORAGE_KEY}`,
    auth_storage:`${import.meta.env.VITE_AUTH_STORAGE}`
}