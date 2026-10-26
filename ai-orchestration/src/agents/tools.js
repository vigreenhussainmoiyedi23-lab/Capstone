import axios from 'axios';
import { tool } from "langchain"
import * as zod from "zod"

export const listFiles = tool(
    async ({ sandbox_agent_url }) => {
        let urlToUse = sandbox_agent_url || 'http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost';
        const response = await axios.get(`${urlToUse}/list-files`);
        return JSON.stringify(response.data.files);
    }, {
    name: "list_files",
    description: "List all the  files in a directory. This is useful for when you need to know what files are available in a directory. and it requires the sandbox agent url",
    inputSchema: zod.object({
        url: zod.string().optional().default('http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost')
    })
}
)

export const readFile = tool(
    async ({ sandbox_agent_url, files: [] }) => {
        let urlToUse = sandbox_agent_url || 'http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost';

        const response = await axios.get(`${urlToUse}/read-files?files=${files.join(',')}`);
        return JSON.stringify(response.data);
    }, {
    name: "read_file",
    description: "Read the contents of a file. This is useful for when you need to read the contents of a file. and it requires the sandbox agent url and the list of files to read as an array (e.g. ['/src/app.jsx','/src/components/Home.jsx',etc.])",
    inputSchema: zod.object({
        url: zod.string().optional().default('http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost'),
        files: zod.array(zod.string()).default([])
    })
}
)

export const createFile = tool(
    async ({ sandbox_agent_url, filePath, content }) => {
        let urlToUse = sandbox_agent_url || 'http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost';
        const response = await axios.post(`${urlToUse}/create-file`, { files: { [filePath]: content } });
        return JSON.stringify(response.data.results);
    }, {
    name: "create_file",
    description: "Create a new file. This is useful for when you need to create a new file. and it requires the sandbox agent url, the file path, and the content to write to the file. (e.g. '/src/app.jsx' , 'console.log(\"Hello World\")\nlet a = 1;')",
    inputSchema: zod.object({
        url: zod.string().optional().default('http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost'),
        filePath: zod.string().min(1).max(1024),
        content: zod.string().min(1).max(1024)
    })
}
)

export const updateFile = tool(
    async ({ sandbox_agent_url, filePath, content }) => {
        let urlToUse = sandbox_agent_url || 'http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost';
        const response = await axios.post(`${urlToUse}/update-file`, { files: { [filePath]: content } });
        return JSON.stringify(response.data.results);
    }, {
    name: "update_file",
    description: "Update an existing file. This is useful for when you need to update an existing file. and it requires the sandbox agent url, the file path, and the content to write to the file. (e.g. '/src/app.jsx' , 'console.log(\"Hello World\")\nlet a = 1;')",
    inputSchema: zod.object({
        url: zod.string().optional().default('http://01a177ce-3787-701c-b3d6-68ea8f63b57b.agent.localhost'),
        filePath: zod.string().min(1).max(1024),
        content: zod.string().min(1).max(1024)
    })
})
