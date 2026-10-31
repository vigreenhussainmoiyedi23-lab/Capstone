import express from "express"
import agent from "../agents/code.agent.js"
import { HumanMessage } from "langchain"
import { custom } from "zod"

const agentRouter = express.Router()

agentRouter.post("/invoke", async (req, res) => {
    const { prompt, projectId } = req.body
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no' // Optional: for Nginx setups
    });
    if (!prompt) return res.status(400).json({ error: "Prompt is required" })
    if (!projectId) return res.status(400).json({ error: "Project id is required" })
    const response = await agent.stream(
        {
            messages: [new HumanMessage(prompt)]
        }
        ,
        {
            context: {
                projectId
            },
            streamMode: "custom"
        })
    const chunks = [];

    for await (const chunk of response) {
        res.write(`data: ${chunk}\n\n`)
    }

    return res.status(200).json({ chunks })
})

export default agentRouter