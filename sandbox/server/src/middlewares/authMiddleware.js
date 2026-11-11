import { redis } from "../config/redis.js";
import { getTokenData } from "../utils/jwt.util.js";


export const isUserVerified = async (req, res, next) => {
  console.log("auth middleware called. ... ... ... ... ...");

  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    console.log("checcking blacklist ..");
    const isBlackListed = await redis.get(`blacklist:${accessToken}`);
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("accessToken", accessToken);

    const decoded = getTokenData(accessToken);

    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token " });
    }

    req.userId = decoded._id
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
