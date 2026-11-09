import REDIS from "ioredis";

const redis = new REDIS(process.env.REDIS_URL)

redis.on("connect", () => {
    console.log("Connected to Redis");
})
redis.on("error", (err) => {
    console.error("Redis error:", err);
})
export async function refreshTTL(sandboxId){
    const exists = await redis.exists(`sandbox:${sandboxId}`);
    if (exists) {
        await redis.expire(`sandbox:${sandboxId}`, 45);
        console.log(`TTL refreshed for sandbox:${sandboxId}`);
    } else {
        console.log(`Key sandbox:${sandboxId} does not exist`);
    }
}