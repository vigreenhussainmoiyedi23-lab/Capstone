import dotenv from "dotenv";
dotenv.config();
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { listFiles, readFile, createFile, updateFile } from "./tools.js";

export const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRALAI_API_KEY,
});

const codeAgent = createAgent({
    model,
    tools: [listFiles, readFile, createFile, updateFile],
})

try {
  const result = await codeAgent.invoke({
    messages: [
      {
        role: "user",
        content: "hi",
      },
    ],
  });

  console.log(result.messages.at(-1)?.content);
} catch (error) {
  console.error("AI agent failed:", error);
}