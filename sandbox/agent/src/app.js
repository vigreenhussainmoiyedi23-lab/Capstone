import express from "express"
import morgan from "morgan"
import fs from "fs"
import path from "path"

const app = express()
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const directoryPath = "/workspace"; // Specify the directory you want to list files from
app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" })
})
/**
 * @route Get /list-files
 * @description List all files in the /workspace directory. exclude node_modules and .git directories. and also show the files like src/app.js or src/controller/payment.controoler.js making sure all the files are listed
 * @returns { files: string[] } - A JSON object containing an array of filenames.
 */

app.get("/list-files", async (req, res) => {
    const workspacePath = "/workspace";

    async function listFiles(dir) {
        const entries = await fs.promises.readdir(dir, {
            withFileTypes: true
        });

        const files = [];

        
        for (const entry of entries) {
            if (["node_modules", ".git"].includes(entry.name)) continue;

            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                files.push(...await listFiles(fullPath));
            } else {
                files.push(
                    path.relative(workspacePath, fullPath).replace(/\\/g, "/")
                );
            }
        }

        return files;
    }

    try {
        const files = await listFiles(workspacePath);
        return res.status(200).json({ files });
    } catch (err) {
        console.error("Error listing files:", err);
        return res.status(500).json({
            error: "Unable to scan workspace"
        });
    } 
});

/**
 * Read the contents of all files in the specified directory.
 */
app.get("/read-files", async (req, res) => {
    const files = req.query.files
    if (!files) {
        return res.status(400).json({ error: "No files specified" })
    }
    const fileList = files.split(",")
    const results = await Promise.all(fileList.map(async (file) => {
        const filePath = `${directoryPath}/${file}`
        try {
            return {
                [filePath]: await fs.promises.readFile(filePath, "utf-8")
            }
        } catch (err) {
            return {
                [filePath]: `Error reading file: ${err.message}`
            }
        }
    }))
    res.status(200).json(results)
})
/**
 * @route /update-files
 * @method POST
 * @description Update the contents of specified files in the /workspace directory.
 * @body {
 *  files: [ { [filename: string]: string } ]
 *  - An array of objects where each object has a single key-value pair representing a filename and its new content.
 * @returns { status: string, updatedFiles: string[] } - A response indicating success and listing the updated files.
 */

app.patch("/update-files", async (req, res) => {
    const filesToUpdate = req.body.files;

    if (!Array.isArray(filesToUpdate) || filesToUpdate.length === 0) {
        return res.status(400).json({
            error: "No files specified for update"
        });
    }

    const results = await Promise.all(
        filesToUpdate.map(async (fileObj) => {
            try {
                const entries = Object.entries(fileObj ?? {});

                if (entries.length !== 1) {
                    throw new Error("Each file object must have one entry");
                }

                const [filename, content] = entries[0];

                if (typeof content !== "string") {
                    throw new Error("File content must be a string");
                }

                // Treat /src/App.jsx as relative to /workspace.
                const relativePath = filename.replace(/^[/\\]+/, "");
                const filePath = path.resolve(directoryPath, relativePath);

                // Prevent writing outside /workspace.
                if (
                    filePath !== directoryPath &&
                    !filePath.startsWith(directoryPath + path.sep)
                ) {
                    throw new Error("Invalid file path");
                }

                await fs.promises.writeFile(filePath, content, "utf-8");

                return {
                    filename,
                    status: "success",
                    message: "Updated successfully"
                };
            } catch (err) {
                return {
                    filename: Object.keys(fileObj ?? {})[0] ?? "unknown",
                    status: "error",
                    message: err.message
                };
            }
        })
    );

    const hasErrors = results.some(
        (result) => result.status === "error"
    );

    return res.status(hasErrors ? 400 : 200).json({
        status: hasErrors ? "partial_failure" : "success",
        results
    });
});

/**
 * @route POST /create-files
 * @description Create new files in the /workspace directory with specified content. 
 * @body {
     files: [ { [filename: string]: string } ]
     - An array of objects where each object has a single key-value pair representing a filename and its content.
 }
*/
app.post("/create-files", async (req, res) => {
    const filesToCreate = req.body.files
    if (!filesToCreate || !Array.isArray(filesToCreate) || filesToCreate.length === 0) {
        return res.status(400).json({ error: "No files specified for creation" })
    }
    const results = await Promise.all(filesToCreate.map(async (fileObj) => {
        const [filename, content] = Object.entries(fileObj)[0]
        const filePath = path.join(directoryPath, filename)
        try {
            await fs.promises.mkdir(path.dirname(filePath), {
                recursive: true
            });

            await fs.promises.writeFile(filePath, content, "utf-8");

            return { [filename]: "Created successfully" };
        } catch (err) {
            return { [filename]: `Error creating file: ${err.message}` };
        }
    }))
    res.status(200).json({ status: "success", message: "Files created successfully", results })
})
/**
 * @route POST /create-folder
 * @description Create a new folder in the /workspace directory.
 * @body {
     folderName: string - The name of the folder to create.
 }
 */
app.post("/create-folder", async (req, res) => {
    const { folderName } = req.body
    if (!folderName) {
        return res.status(400).json({ error: "Folder name is required" })
    }
    const folderPath = path.join(directoryPath, folderName)
    try {
        await fs.promises.mkdir(folderPath, { recursive: true })
        res.status(201).json({ status: "success", message: "Folder created successfully" })
    } catch (err) {
        res.status(500).json({ error: `Error creating folder: ${err.message}` })
    }
})

export default app
