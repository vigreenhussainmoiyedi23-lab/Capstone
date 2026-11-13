import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { addCodeFile, listAllFiles, setSandboxData } from "../sandbox.slice.js";
import { startSandboxEnvironment } from "../services/sandbox.api.js";
import { listWorkspaceFiles, readWorkspaceFiles } from "../services/agent.api.js";
import { useNavigate } from "react-router-dom";
const getLanguageFromFile = (filename = "") => {
    if (filename.endsWith(".jsx")) return "jsx";
    if (filename.endsWith(".js") || filename.endsWith(".mjs"))
        return "javascript";
    if (filename.endsWith(".tsx")) return "tsx";
    if (filename.endsWith(".ts")) return "typescript";
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".md")) return "markdown";
    return "text";
};
export const useSandbox = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const createSandbox = useCallback(async (projectId) => {
        setIsLoading(true);
        setError(null);
        try {
            const sandboxData = await startSandboxEnvironment(projectId);
            console.log("Sandbox created successfully:", sandboxData);

            const normalized = {
                sandboxId: sandboxData.sandboxId,
                previewUrl: sandboxData.previewUrl,
                agentUrl: sandboxData.agentUrl,
            };

            dispatch(setSandboxData(normalized));
            navigate(`/chats/${sandboxData.sandboxId}`)
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

    const fetchFiles = useCallback(async (projectId) => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const { files } = await listWorkspaceFiles(projectId);
            dispatch(listAllFiles(files))
        } catch (err) {
            console.error("Error fetching workspace files:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getFileContent = useCallback(async ({ path, projectId }) => {
        if (!projectId || !path) return;
        setIsLoading(true);
        try {
            const res = await readWorkspaceFiles(projectId, [path])
            const content = res[0]['/workspace/' + path]

            dispatch(addCodeFile({
                fileName: path,
                content
            }))
            return content
        } catch (err) {
            console.error("Error fetching file content:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch file content";
            setError(errorMessage);
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        createSandbox,
        isLoading,
        error,
        fetchFiles,
        getFileContent
    };
};
