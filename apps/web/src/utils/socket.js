import { io } from "socket.io-client";

export const socket = io(`ws://${import.meta.env.SERVER_URL}/`, {
    reconnectionDelayMax: 10000,
    // auth: {
    //     token: "123"
    // },
    // query: {
    //     "my-key": "my-value"
    // }
});