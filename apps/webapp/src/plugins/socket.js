import { io } from "socket.io-client";
import { config } from "../config";

export default {
    install: (app) => {
        const socket = io(`${config.backend_ssl ? 'wss' : 'ws'}://${config.backend_host}/`, {
            reconnectionDelayMax: 10000,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000,
            timeout: 20000,
            // auth: {
            //     token: "123"
            // },
        });
        app.use('socket', socket)
        app.config.globalProperties.socket = socket;
    }
}p