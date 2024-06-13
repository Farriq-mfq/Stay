import { io } from "socket.io-client";

const socket = io(`ws://localhost:3000/`, {
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