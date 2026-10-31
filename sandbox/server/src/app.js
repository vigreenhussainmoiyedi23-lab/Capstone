import express from "express";
import morgan from "morgan";
import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { v7 as uuid } from "uuid"

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "pod is healthy" });
});
app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid();

    try {
        await Promise.all([createPod(sandboxId), createService(sandboxId)]);
        res.status(200).json({
            status: "ok",
            message: "Sandbox environment Created successfully",
            previewUrl: `http://${sandboxId}.preview.localhost`,
            sandboxId
        });
    } catch (error) {
        console.error("Error starting sandbox:", error);
        res.status(500).json({ status: "error", message: "Failed to start sandbox" ,error});
    }
});

export default app;