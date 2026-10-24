import express from "express"
import morgan from "morgan"
import fs from "fs"

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

app.post("/list-files", async (req, res) => {
    try {
        const files = await fs.promises.readdir(directoryPath)
        res.status(200).json({ files })
    } catch (err) {
        res.status(500).json({ error: "Unable to scan directory" })
    }
})

export default app
