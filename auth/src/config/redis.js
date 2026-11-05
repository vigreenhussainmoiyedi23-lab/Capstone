import { createClient } from "redis";
import { config } from "./config.js";

export const redis = createClient({
  url: config.REDIS_URL,
});

export async function connectRedis(retries = 5) {
  try {
    if (redis.isOpen) return;

    await redis.connect();
    console.log("✅ Redis connected");
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(
      `Redis connection failed. Retrying... (${retries} attempts left)`,
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return connectRedis(retries - 1);
  }
}

