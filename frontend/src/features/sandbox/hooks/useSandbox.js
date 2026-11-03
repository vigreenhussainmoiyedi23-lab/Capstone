import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { setSandboxData } from "../sandbox.slice";
import { createSandboxEnvironment } from "../services/sandbox.api";

export const useSandbox = () => {
    const dispatch = useDispatch();
    const sandbox = useSelector((state) => state.sandbox);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSandbox = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const sandboxData = await createSandboxEnvironment();
            console.log("Sandbox created successfully:", sandboxData);

            const normalized = {
                sandboxId: sandboxData.id || sandboxData.sandboxId,
                previewUrl: sandboxData.previewUrl,
                agentUrl: sandboxData.agentUrl,
            };

            dispatch(setSandboxData(normalized));
            return sandboxData;
        } catch (err) {
            console.error("Error creating sandbox:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to create sandbox environment";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    return {
        createSandbox,
        isLoading,
        error,
        sandboxId: sandbox?.sandboxId,
        previewUrl: sandbox?.previewUrl,
        agentUrl: sandbox?.agentUrl,
    };
};
