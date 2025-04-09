export const config = {
    backend_host: `${import.meta.env.VITE_API_URL}`,
    backend_ssl: import.meta.env.VITE_API_SSL,
    STORAGE_KEY: `@webapp`,
}