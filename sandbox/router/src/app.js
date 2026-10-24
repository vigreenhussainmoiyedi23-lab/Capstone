import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const proxies = {};
const agentProxies = {};
function getAgentProxy(sandboxId) {
    if (!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}:3000`,
            changeOrigin: true,
            ws: true
        });
    }
    return agentProxies[sandboxId];
}

function getProxy(sandboxId) {
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}`,
            changeOrigin: true,
            ws: true
        });
    }
    return proxies[sandboxId];
}

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" });
});
app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split(".")[0];
    if (host.split(".")[1] === "agent") {
        return getAgentProxy(sandboxId)(req, res, next);
    }
    else if (host.split(".")[1] === "preview") {
        return getProxy(sandboxId)(req, res, next);
    }
});

export default app;