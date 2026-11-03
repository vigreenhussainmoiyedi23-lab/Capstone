import api from "../../../app/axios";

/**
 * Creates a new sandbox container on the backend.
 * Expected response: { id: string, previewUrl: string, agentUrl: string }
 */
export const createSandboxEnvironment = async () => {
    try {
        const response = await api.post("/api/sandbox/create");
        return response.data;
    } catch (error) {
        console.error("Error creating sandbox environment:", error);
        throw error;
    }
};

/**
 * Agent API — List all files in the /workspace directory.
 */
export const listWorkspaceFiles = async (agentUrl) => {
    const baseUrl = agentUrl || "";
    const res = await fetch(`${baseUrl}/list-files`);
    if (!res.ok) throw new Error(`Failed to list files: ${res.status}`);
    return await res.json(); // { files: string[] }
};

/**
 * Agent API — Read contents of specified files.
 */
export const readWorkspaceFiles = async (agentUrl, files = []) => {
    const baseUrl = agentUrl || "";
    const filesParam = encodeURIComponent(Array.isArray(files) ? files.join(",") : files);
    const res = await fetch(`${baseUrl}/read-files?files=${filesParam}`);
    if (!res.ok) throw new Error(`Failed to read files: ${res.status}`);
    return await res.json(); // [ { [filePath]: content } ]
};

/**
 * Agent API — Update files in /workspace.
 */
export const updateWorkspaceFiles = async (agentUrl, files = []) => {
    const baseUrl = agentUrl || "";
    const res = await fetch(`${baseUrl}/update-files`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
    });
    if (!res.ok) throw new Error(`Failed to update files: ${res.status}`);
    return await res.json();
};

/**
 * Agent API — Create new files in /workspace.
 */
export const createWorkspaceFiles = async (agentUrl, files = []) => {
    const baseUrl = agentUrl || "";
    const res = await fetch(`${baseUrl}/create-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
    });
    if (!res.ok) throw new Error(`Failed to create files: ${res.status}`);
    return await res.json();
};

/**
 * Agent API — Create a folder in /workspace.
 */
export const createWorkspaceFolder = async (agentUrl, folderName) => {
    const baseUrl = agentUrl || "";
    const res = await fetch(`${baseUrl}/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName }),
    });
    if (!res.ok) throw new Error(`Failed to create folder: ${res.status}`);
    return await res.json();
};

/**
 * Agent API — Check readiness & health.
 */
export const checkAgentHealth = async (agentUrl) => {
    const baseUrl = agentUrl || "";
    const res = await fetch(`${baseUrl}/api/status/healthz`);
    return res.ok;
};
