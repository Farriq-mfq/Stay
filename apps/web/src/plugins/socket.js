import { io } from "socket.io-client";
import { config } from "../config";

const socket = io(`${config.backend_ssl ? 'wss' : 'ws'}://${config.backend_host}/`, {
    reconnectionDelayMax: 10000,
    // auth: {
    //     token: "123"
    // },
    // query: {
    //     "my-key": "my-value"
    // }
});

export default {
    install: (app) => {
        app.use('socket', socket)
        app.config.globalProperties.socket = socket;
    }
}