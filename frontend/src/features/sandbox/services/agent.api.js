import api from "../../../app/axios";


export const getAPIBaseUrl = (projectId) => {
    return `http://${projectId}.agent.localhost`;
};

/**
* Agent API — List all files in the /workspace directory.
*/
export const listWorkspaceFiles = async (projectId) => {
    
    const baseUrl = getAPIBaseUrl(projectId);
    const res = await api.get(`${baseUrl}/list-files`);
    if (!res.ok) throw new Error(`Failed to list files: ${res.status}`);
    return await res.json(); // { files: string[] }
};

/**
 * Agent API — Read contents of specified files.
 */
export const readWorkspaceFiles = async (projectId, files = []) => {
    const baseUrl = getAPIBaseUrl(projectId);
    const filesParam = encodeURIComponent(Array.isArray(files) ? files.join(",") : files);
    const res = await api.get(`${baseUrl}/read-files?files=${filesParam}`);
    if (!res.ok) throw new Error(`Failed to read files: ${res.status}`);
    return await res.json(); // [ { [filePath]: content } ]
};

/**
 * Agent API — Update files in /workspace.
 */
export const updateWorkspaceFiles = async (projectId, path, content) => {
    const baseUrl = getAPIBaseUrl(projectId);
    const res = await api.patch(`${baseUrl}/update-files`, {
        files: [{ [path]: content }]
    });
    if (!res.ok) throw new Error(`Failed to update files: ${res.status}`);
    return await res.json();
};

/**
 * Agent API — Create new files in /workspace.
 */
export const createWorkspaceFiles = async (projectId, path, content) => {
    const baseUrl = getAPIBaseUrl(projectId);
    const res = await api.post(`${baseUrl}/create-files`, {
        files: [{ [path]: content }]
    });
    if (!res.ok) throw new Error(`Failed to create files: ${res.status} `);
    return await res.json();
};
