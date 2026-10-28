import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent, modelFallbackMiddleware } from "langchain";
import { listFiles, readFile, createFile, updateFile } from "./tools.js";
import { input } from "@inquirer/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOllama } from "@langchain/ollama";

export const Ollamamodel = new ChatOllama({
    model: "qwen3.5:9b",
    temperature: 0,
});

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    temperature: 0,
    maxRetries: 2,
    // other params...
})
const geminiFallback = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.6-flash",
  temperature: 0,
  maxRetries: 1,
});
const GroqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Default value.
    model: "openai/gpt-oss-20b",
});


const codeAgent = createAgent({
    model: Ollamamodel,
    tools: [listFiles, readFile, createFile, updateFile],
    middleware: [
        modelFallbackMiddleware(geminiModel,geminiFallback,GroqModel)
    ],
    systemPrompt: `
    You are an AI frontend coding agent working inside a React workspace.

    Rules:
    1. Understand the user's requested UI change.
    2. Inspect only the files relevant to that change.
    3. Read the existing component before editing it.
    4. Make the smallest complete change that satisfies the request.
    5. Use updateFile to modify existing files.
    6. Use createFile only when a new file is necessary.
    7. Preserve existing functionality, imports, and project conventions.
    8. Do not rewrite unrelated files.
    9. After editing, briefly report which files changed.
    10. Never claim a change was made unless the tool succeeded.
  `,
})

while (true) {
    try {
        const prompt = await input({ message: "user: " });
        const result = await codeAgent.invoke({ messages: [new HumanMessage(`${prompt}`)] })
    } catch (error) {
        console.error("AI agent failed:", error);
    }
}

