import { io } from "socket.io-client";
import { config } from "../config";
import { v4 as uuidv4 } from 'uuid';

export default {
    install: (app) => {
        let clientId = localStorage.getItem(`${config.token_key}/clientId`);

        if (clientId === undefined || clientId === null) {
            clientId = uuidv4();
            localStorage.setItem(`${config.token_key}/clientId`, clientId);
        }

        const socket = io(`${config.backend_ssl ? 'wss' : 'ws'}://${config.backend_host}/`, {
            reconnectionDelayMax: 10000,
            // auth: {
            //     token: "123"
            // },
            query: {
                clientId
            }
        });
        app.use('socket', socket)
        app.config.globalProperties.socket = socket;
    }
}