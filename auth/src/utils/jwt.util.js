import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

// If using TypeScript
export const createTokenFromData = (
  data,
  expiresIn,
) => {
  return jwt.sign(data, config.JWT_SECRET, { expiresIn: expiresIn ?? "1d" });
};

export const getTokenData = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token,config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
