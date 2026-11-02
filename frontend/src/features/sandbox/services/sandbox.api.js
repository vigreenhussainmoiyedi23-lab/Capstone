import api from "../../../app/axios";

export const createSandboxEnvironment = async () => {
    try {
        const response = await api.post("/api/sandbox/create");
        return response.data;
    } catch (error) {
        console.error("Error creating sandbox environment:", error);
        throw error;
    }
}