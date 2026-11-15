import api from "../../../app/axios";

/**
 * starts a new sandbox pod on the kubernetes cluster. And uses projectId for fetching files from AWS s3 and also projectId is used for syncing the data to aws s3
 * Expected response: {
    "status": "ok",
    "message": "Sandbox environment Created successfully",
    "previewUrl": "http://{dynamically_generated}.preview.localhost",
    "sandboxId": "{dynamically_generated}"
}
 */
export const startSandboxEnvironment = async (projectId) => {
    try {
        const response = await api.post("/api/sandbox/start", {
            projectId
        });
        return response.data;
    } catch (error) {
        console.error("Error starting sandbox environment:", error);
        throw error;
    }
};

/**
 * @description creates a project for the logged in user 
 * @body requires a title of the project , by default a untitled project
 * @response {
    "status": "ok",
    "message": "Project created successfully",
    "project": {
        "title": "UNtitle PROJECT",
        "user": "6af07ba2feba81df2dd474f1",
        "_id": "6af71fb84ca55aaf59af816b",
        "__v": 0
    }
}
 */
export const createNewProject = async (data) => {
    try {
        const response = await api.post("/api/sandbox/project", data)
        return response.data
    } catch (error) {
        console.error("Error creating a project:", error);
        throw error;
    }
}
/**
 * @description all the projects of the logged in user gets
 * @response {
    "status": "ok",
    "message": "Projects fetched successfully",
    "projects": [
        {
            "_id": "6af456c60eada9afc068b283",
            "title": "New Projecyt",
            "user": "6af07ba2feba81df2dd473f1",
            "__v": 0
        },
        {
            "_id": "6af456dd0eada9afc068b284",
            "title": "New Project 1 2 3",
            "user": "6af07ba2feba81df2dd473f1",
            "__v": 0
        },
    ]
}
 */
export const GetAllProjects = async () => {
    try {
        const response = await api.get("/api/sandbox/projects")
        return response.data
    } catch (error) {
        console.error("Error fetching all projects:", error);
        throw error;
    }
}