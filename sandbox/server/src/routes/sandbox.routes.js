import { Router } from "express";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { setSandboxKey } from "../config/redis.js";
import { v7 as uuid } from "uuid"
import projectModel from "../models/project.model.js";

const sandboxRouter = Router();

sandboxRouter.post("/start", async (req, res) => {
    const sandboxId = uuid();
    const { projectId } = req.body
    try {
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId),
            setSandboxKey(sandboxId)
        ]);

        res.status(200).json({
            status: "ok",
            message: "Sandbox environment Created successfully",
            previewUrl: `http://${sandboxId}.preview.localhost`,
            sandboxId
        });
    } catch (error) {
        console.error("Error starting sandbox:", error);
        res.status(500).json({ status: "error", message: "Failed to start sandbox", error });
    }
})
sandboxRouter.post("/project", async (req, res) => {
    const { title } = req.body;
    try {
        const project = await projectModel.create({ title, user: req.userId });
        res.status(200).json({ status: "ok", message: "Project created successfully", project });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ status: "error", message: "Failed to create project", error });
    }
})
sandboxRouter.get("/projects", async (req, res) => {
    try {
        const projects = await projectModel.find({ user: req.userId });
        res.status(200).json({ status: "ok", message: "Projects fetched successfully", projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch projects", error });
    }
})

export default sandboxRouter