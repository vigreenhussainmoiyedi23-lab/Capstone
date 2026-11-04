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
