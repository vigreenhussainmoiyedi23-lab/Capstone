// shared/sockets/socket.js

import { io } from "socket.io-client";

export const socket = io(
    import.meta.env.VITE_AGENT_SOCKET_URL,
    {
        autoConnect: false,
        withCredentials: true
    }
);