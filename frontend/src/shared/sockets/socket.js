// shared/sockets/socket.js

import { io } from "socket.io-client";

export const getSocket = (socketURL) => {

    const socket = io(
        socketURL,
        {
            autoConnect: false,
            withCredentials: true,
            transports: ["websocket", "polling"]
        }
    );
    return socket
} 