import api from "../../../app/axios";


export const getAPIBaseUrl = (projectId) => {
    return `http://${projectId}.agent.localhost`;
};

/**
* Agent API — List all files in the /workspace directory.
*/
export const listWorkspaceFiles = async (projectId) => {
    try {

        const baseUrl = getAPIBaseUrl(projectId);
        const res = await api.get(`${baseUrl}/list-files`);
        return res.data // { files: string[] }
    } catch (error) {
        throw error
    }
};

/**
 * Agent API — Read contents of specified files.
 */
export const readWorkspaceFiles = async (projectId, files = []) => {
    try {
        const baseUrl = getAPIBaseUrl(projectId);
        const res = await api.get(`${baseUrl}/read-files?files=${files.join(",")}`);
        return res.data // { files: string[] }
    } catch (error) {
        throw error
    }
}
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
