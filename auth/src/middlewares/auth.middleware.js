import { getTokenData } from "../utils/jwt.util.js";
import { redis } from "../config/redis.js";
import userModel from "../models/user.model.js";

export const isUserVerified = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    const isBlackListed = await redis.get(`blacklist:${accessToken}`);
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = getTokenData(accessToken);

    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token " });
    }
    const cachedUser = await redis.get("user:" + decoded._id);
    if (cachedUser) req.user = JSON.parse(cachedUser);
    else {
      const user = await userModel.findById(decoded._id);
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
      req.user = user;
      await redis.set("user:" + decoded._id, JSON.stringify(user), {
        EX: 60,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const isUserAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};