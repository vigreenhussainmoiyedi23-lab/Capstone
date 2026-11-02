import { useDispatch } from "react-redux";
import { setSandboxData } from "../sandbox.slice";
import { createSandboxEnvironment } from "../services/sandbox.api"


export const useSandbox = () => {
    const dispatch = useDispatch();
    const createSandbox = async () => {
        try {
            const sandboxData = await createSandboxEnvironment();

            console.log("Sandbox created successfully:", sandboxData);
            dispatch(setSandboxData({
                sandboxId: sandboxData.id,
                previewUrl: sandboxData.previewUrl,
                agentUrl: sandboxData.agentUrl
            }));
        } catch (error) {
            console.error("Error creating sandbox:", error);
        }
    };

    return { createSandbox };
};