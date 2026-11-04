
import { useEffect, useState } from "react";
import { getSocket } from "../sockets/socket";
import { useDispatch } from "react-redux";
import { addTerminalMessage } from "../../features/ai/ai.slice";
export const useProjectSocket = (projectId) => {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!projectId) return;

        const socketInstance = getSocket(
            `http://${projectId}.agent.localhost`
        );

        const onConnect = () => {
            console.log("Connected:", socketInstance.id);
        };

        const onConnectError = (error) => {
            console.error("Socket error:", error.message);
        };

        socketInstance.on("connect", onConnect);
        socketInstance.on("connect_error", onConnectError);
        socketInstance.on("terminal-output", (data) => {
            dispatch(addTerminalMessage(data));
        });
        setSocket(socketInstance);
        socketInstance.connect();

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("connect_error", onConnectError);

            socketInstance.disconnect();
            setSocket(null);
        };
    }, [projectId]);

    return socket;
};
