import express from "express"
import agent from "../agents/code.agent.js"
import { HumanMessage } from "langchain"

const agentRouter = express.Router()

agentRouter.post("/invoke", async (req, res) => {
    const prompt = req.body.prompt
    if (!prompt) return res.status(400).json({ error: "Prompt is required" })
    const response = await agent.invoke({ messages: new HumanMessage(prompt) })
    return res.status(200).json({ response })
})

export default agentRouter