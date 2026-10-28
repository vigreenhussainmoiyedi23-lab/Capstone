import axios from 'axios';
import { tool } from "langchain"
import * as zod from "zod"

const sandboxId = "01a17d86-1687-7014-92ae-7ef27ee80a10"
const sandboxClient = axios.create({
    baseURL: "http://127.0.0.1",
    // timeout: 15_000,
    headers: {
        Host: `${sandboxId}.agent.localhost`,
    },
});
export const listFiles = tool(
    async ({ }) => {
        try {
            console.log("using listing tool");

            const response = await sandboxClient.get("/list-files");

            const files = response.data.files.map((file) =>
                file.replace(/^[/\\]+/, "").replace(/^workspace[/\\]?/, "")
            );

            console.log("response", files);

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
    async ({ files }) => {
        console.log("using reading file tool", files);

        const response = await sandboxClient.get("/read-files", {
            params: {
                files: files.join(","),
            },
        });

        return JSON.stringify(response.data);
    },
    {
        name: "read_file",
        description:
            "Read one or more files from the workspace. Pass files as an array of absolute file paths, for example { files: [\"/workspace/src/App.jsx\"] }.",
        schema: zod.object({
            files: zod.array(zod.string().min(1)).min(1),
        }),
    }
);

export const createFile = tool(
    async ({ filePath, content }) => {
        console.log("CONTENT:", JSON.stringify(content));
        console.log("CONTENT LENGTH:", content.length);
        const files = [
            {
                [filePath]: content
            }
        ]
        console.log("using creating file tool", files)
        const response = await sandboxClient.post(`/create-files`, { files });
        console.log("response From APi : -", response.data.results)
        return JSON.stringify(response.data.results);
    }, {
    name: "create_file",
    description: `Create a new file. This is useful for when you need to create a new file. and it requires the sandbox agent url, the file path, and the content to write to the file. (e.g. 'src/app.jsx' , 'console.log(\"Hello World\")\nlet a = 1;')
    do not use /src/app.jsx or ./src/app.jsx or /workspace/src/app.jsx
    
    `,
    schema: zod.object({
        filePath: zod.string().min(1).max(1024),
        content: zod.string().min(1).max(50_000)
    })
}
)

export const updateFile = tool(
    async ({ filePath, content }) => {
        console.log("CONTENT:", JSON.stringify(content));
        console.log("CONTENT LENGTH:", content.length);
        console.log("using updating file tool", filePath, content)
        const files = [
            {
                [filePath]: content
            }
        ]
        const response = await sandboxClient.patch(`/update-files`, { files });
        console.log(response.data.results)
        return JSON.stringify(response.data.results);
    }, {
    name: "update_file",
    description: `"Update an existing workspace file with its complete new content.

Rules:
- Use an absolute path such as /src/App.jsx. Do not use  /workspace/src/App.jsx or ./src/App.jsx.
- Read the file before modifying it.
- Preserve existing functionality and unrelated code.
- Supply the complete updated file content, not a partial snippet.
- Call this tool once per file and inspect its result."`,
    schema: zod.object({
        filePath: zod.string().min(1).max(1024),
        content: zod.string().min(1).max(50_000)
    })
})
