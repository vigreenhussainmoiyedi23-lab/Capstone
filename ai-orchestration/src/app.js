import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.routes.js";
import cors from "cors"
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((req, res, next) => {
    console.log("Origin:", req.headers.origin);
    next();
});
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