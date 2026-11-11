import express from "express";
import morgan from "morgan";
import sandboxRouter from "./routes/sandbox.routes.js";
import cookieParser from "cookie-parser";
import { isUserVerified } from "./middlewares/authMiddleware.js";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "pod is healthy" });
});



app.use("/api/sandbox", isUserVerified, sandboxRouter)



export default app;