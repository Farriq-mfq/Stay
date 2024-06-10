import axios from 'axios'
export const instance = axios.create({
    baseURL: `http://${import.meta.env.SERVER_URL}/`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})