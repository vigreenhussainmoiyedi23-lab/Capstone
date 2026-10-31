import axios from 'axios';
import { tool } from "langchain"
import * as zod from "zod"

export function createSandboxClient(sandboxId) {
    return axios.create({
        baseURL: `http://sandbox-service-${sandboxId}:3000`,
    });
}

export const listFiles = tool(
    async ({ }, config) => {
        console.log("LATEST TOOLS BEING USED")
        try {
            const writer = config.writer
            writer("listing files in the workspace...")
            const sandboxClient = createSandboxClient(config.context.projectId);

            const response = await sandboxClient.get("/list-files");
            const files = response.data.files.map((file) =>
                file.replace(/^[/\\]+/, "").replace(/^workspace[/\\]?/, "")
            );

            writer(" files listed successfully")
            return JSON.stringify(files);
        } catch (error) {
            console.error("error", error);
            return "An error occurred while listing files retry";
        }
    }, {
    name: "list_files",
    description: "List all the  files in a directory. This is useful for when you need to know what files are available in a directory. and it requires the sandbox agent url",
    schema: zod.object({})
}
)

export const readFile = tool(
    async ({ files }, config) => {
        console.log("LATEST TOOLS BEING USED")

        const writer = config.writer
        writer("reading files in the workspace..." + files)
        const sandboxClient = createSandboxClient(config.context.projectId);

        const response = await sandboxClient.get("/read-files", {
            params: {
                files: files.join(","),
            },
        });
        writer(" files read successfully")
        return JSON.stringify(response.data);
    },
    {
        name: "read_file",
        description:
            "Read one or more files from the workspace. Pass files as an array of absolute file paths, for example { files: [\"/src/App.jsx\"] }.",
        schema: zod.object({
            files: zod.array(zod.string().min(1)).min(1),
        }),
    }
);

export const createFile = tool(
    async ({ filePath, content }, config) => {
        console.log("LATEST TOOLS BEING USED")

        const writer = config.writer
        writer("creating files in the workspace..." + filePath)
        const files = [
            {
                [filePath]: content
            }
        ]
        const sandboxClient = createSandboxClient(config.context.projectId);

        const response = await sandboxClient.post(`/create-files`, { files });
        writer(" files created successfully")
        return JSON.stringify(response.data.results);
    }, {
    name: "create_file",
    description: `Create a new file. This is useful for when you need to create a new file. and it requires the sandbox agent url, the file path, and the content to write to the file. (e.g. 'src/app.jsx' , 'console.log(\"Hello World\")\nlet a = 1;')
    do not use  /workspace/src/app.jsx
    
    `,
    schema: zod.object({
        filePath: zod.string().min(1).max(1024),
        content: zod.string().min(1).max(50_000)
    })
}
)

export const updateFile = tool(
    async ({ filePath, content }, config) => {
        console.log("LATEST TOOLS BEING USED")

        try {
            const writer = config.writer
            writer("updating files in the workspace..." + filePath)
            const sandboxClient = createSandboxClient(config.context.projectId);

            const response = await sandboxClient.patch("/update-files", {
                files: [{ [filePath]: content }],
            });
            writer(" files updated successfully")
            return JSON.stringify(response.data.results);
        } catch (error) {
            console.log("error occured while updating the file :" + filePath, error);
            if (axios.isAxiosError(error)) {
                return JSON.stringify({
                    success: false,
                    filePath,
                    status: error.response?.status,
                    error: error.response?.data ?? error.message,
                });
            }

            return JSON.stringify({
                success: false,
                filePath,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    {
        name: "update_file",
        description: "Update an existing workspace file with its complete content. do not use /workspace/src/app.jsx instead use /src/app.jsx ./src/app.jsx src/app.jsx",
        schema: zod.object({
            filePath: zod.string().min(1).max(1024),
            content: zod.string().min(1).max(50_000),
        }),
    }
);
