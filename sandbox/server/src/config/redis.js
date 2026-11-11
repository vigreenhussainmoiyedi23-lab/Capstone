import REDIS from "ioredis";
import { deletePod } from "../kubernetes/pod.js";
import { deleteService } from "../kubernetes/service.js";

export const redis = new REDIS(process.env.REDIS_URL)

const subscriber = new REDIS(process.env.REDIS_URL)

export async function setSandboxKey(sandboxId, expireInSeconds = 60 * 10) {
    await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
        status: "active",
    }), "EX", expireInSeconds);
}

subscriber.config("SET", "notify-keyspace-events", "Ex");

subscriber.subscribe("__keyevent@0__:expired");

subscriber.on("message", async (channel, key) => {
    const sandboxId = key.split(":")[1];
    console.log(`Sandbox ${sandboxId} has expired`);
    await Promise.all([
        deletePod(sandboxId),
        deleteService(sandboxId)
    ]);
});

export default {  subscriber };