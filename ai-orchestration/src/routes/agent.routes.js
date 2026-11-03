
import express from "express";
import agent from "../agents/code.agent.js";
import { HumanMessage } from "langchain";

const agentRouter = express.Router();


agentRouter.post("/invoke", async (req, res) => {
    try {
        const { prompt, projectId } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        if (!projectId) {
            return res.status(400).json({ error: "Project id is required" });
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        });

        const stream = await agent.stream(
            {
                messages: [new HumanMessage(prompt)]
            },
            {
                context: { projectId },
                streamMode: ["custom", "values"]
            }
        );

        let finalMessage = null;

        for await (const [mode, chunk] of stream) {

            if (mode === "custom") {
                res.write(
                    `event: update\ndata: ${JSON.stringify(chunk)}\n\n`
                );
            }

            if (mode === "values") {
                const messages = chunk.messages ?? [];

                const aiMessages = messages.filter(message => {
                    const isAI =
                        message.type === "ai" ||
                        message.getType?.() === "ai";

                    const hasToolCalls =
                        message.tool_calls?.length > 0;

                    return isAI && !hasToolCalls;
                });

                if (aiMessages.length > 0) {
                    finalMessage = aiMessages[aiMessages.length - 1];
                }
            }
        }

        const finalResponse =
            finalMessage?.content ||
            finalMessage?.additional_kwargs?.reasoning_content ||
            null;
        res.write(
            `event: complete\ndata: ${JSON.stringify({
                success: true,
                response: finalResponse
            })}\n\n`
        );

        return res.end();

    } catch (error) {
        console.error("Agent invocation error:", error);

        if (res.headersSent) {
            res.write(
                `event: error\ndata: ${JSON.stringify({
                    success: false,
                    error: error.message
                })}\n\n`
            );

            return res.end();
        }

        return res.status(500).json({
            error: "Agent execution failed"
        });
    }
});


export default agentRouter;
