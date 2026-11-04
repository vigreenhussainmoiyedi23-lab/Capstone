import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { addCodeFile, listAllFiles, setSandboxData } from "../sandbox.slice.js";
import { createSandboxEnvironment } from "../services/sandbox.api.js";
import { listWorkspaceFiles } from "../services/agent.api.js";

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
    const getAllFiles = useCallback(async (projectId) => {
        try {
            const response = await listWorkspaceFiles(projectId);
            dispatch(listAllFiles(response.files));
            console.log("All files listed successfully:", response.files);
        } catch (error) {
            console.error("Error listing all files:", error.response?.data?.message || error.message || "Failed to list all files");
        }
    }, []);
    return {
        createSandbox,
        isLoading,
        error,
        getAllFiles,
    };
};
