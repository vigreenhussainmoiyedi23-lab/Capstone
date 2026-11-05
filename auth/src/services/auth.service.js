import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import { createTokenFromData } from "../utils/jwt.util.js";
import { hashToken } from "../utils/crypto.util.js";


export const CreateTokensAndSession = async ({
  _id,
  ip,
  userAgent,
}) => {
  const refreshToken = createTokenFromData({ _id }, "7d");
  const accessToken = createTokenFromData({ _id }, "15min");
  const hashedRefreshToken = hashToken(refreshToken);
  const session = await sessionModel.create({
    user: _id,
    refreshToken: hashedRefreshToken,
    ip,
    userAgent,
  });

  return { accessToken, refreshToken, session };
};

export const createTokensAndUpdateSession = async ({
  _id,
  ip,
  userAgent,
  oldRefreshToken,
}) => {
  const refreshToken = createTokenFromData({ _id }, "7d");
  const accessToken = createTokenFromData({ _id }, "15min");

  const hashedRefreshToken = hashToken(refreshToken);
  const hashedOldRefreshToken = hashToken(oldRefreshToken);

  await sessionModel.findOneAndUpdate(
    { user: _id, refreshToken: hashedOldRefreshToken },
    { refreshToken: hashedRefreshToken, ip, userAgent },
  );

  return { accessToken, refreshToken };
};

export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};
