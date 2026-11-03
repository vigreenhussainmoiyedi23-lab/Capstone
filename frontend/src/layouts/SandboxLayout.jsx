import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function SandboxLayout({ sandboxData }) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!sandboxData?.agentUrl) return;

        const socketInstance = io(sandboxData.agentUrl, {
            autoConnect: false,
            withCredentials: true,
            reconnection: true,
        });

        socketInstance.on("connect", () => {
            setConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setConnected(false);
        });

        socketInstance.connect();
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
            setSocket(null);
            setConnected(false);
        };
    }, [sandboxData?.agentUrl]);

    return (
        <div>
            {/* Your workspace components */}
        </div>
    );
}