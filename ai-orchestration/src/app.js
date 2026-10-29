import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.routes.js";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/status/healthz", (req, res) => {
  res.send("Hello, World!");
})
app.get("/api/status/readyz", (req, res) => {
  res.send("Hello, World!");
})
app.get("/api/ai/healthz", (req, res) => {
  res.send("Hello , World! from Ai orchestration");
});


app.use("/api/ai", agentRouter)

export default app;