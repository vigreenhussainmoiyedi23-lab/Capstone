import userModel from "../models/user.model.js";
import {
    CreateTokensAndSession,
    createTokensAndUpdateSession,
    generateOTP,
} from "../services/auth.service.js";
import { createTokenFromData, getTokenData } from "../utils/jwt.util.js";
import { clearSecureCookie, sendSecureCookie } from "../utils/cookie.util.js";
import { createUser } from "../services/userCRUD.service.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import SendEmail from "../utils/sendOtp.js";
import { hashToken } from "../utils/crypto.util.js";
import asyncHandler from "../utils/AsyncHandler.js";
import AppError from "../utils/AppError.js";
import { config } from "../config/config.js";
import { redis } from "../config/redis.js";

export const registerController = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    const isUserExist = await userModel.findOne({ email });
    if (role === "admin") {
        throw new AppError("You can't register as admin", 400);
    }
    if (isUserExist && isUserExist.isVerified) {
        throw new AppError("User already exists", 400);
    }
    if (isUserExist && !isUserExist.isVerified) {
        await userModel.deleteOne({ email }); // it gets deleted from database and doesnt slows user rs time
    }
    const otp = generateOTP();
    const newUser = await createUser({
        username,
        email,
        password,
        otp,
        role: role || "user",
        otpExpiresIn: new Date(Date.now() + 10 * 60 * 1000),
        authMethod: "email",
    });

    const token = createTokenFromData({ _id: newUser._id }, "15min");
    sendSecureCookie(res, "tokenForOtp", token, 15 * 60 * 1000); // {res,name,value,maxAgeInMs}
    res
        .status(201)
        .json({ message: "Verifification OTP has been sent", success: true });
    const html = `
  <h1 style="text-align: center;">Verification OTP</h1>
  <h1 style="text-align: center;">${otp}</h1>
  `;
    await SendEmail({
        to: email,
        subject: "Verification OTP",
        html,
    });
});

export const resendOtpHandler = asyncHandler(async (req, res) => {
    let decoded = null;
    const token = req.cookies.tokenForOtp;
    decoded = getTokenData(token);
    if (!decoded._id || !decoded) {
        throw new AppError("Invalid token", 400);
    }
    const isUserExist = await userModel.findById(decoded._id);
    if (!isUserExist) {
        throw new AppError("User does not exist", 400);
    }
    if (
        !isUserExist.otp ||
        !isUserExist.otpExpiresIn ||
        isUserExist.otpExpiresIn.getTime() < Date.now()
    ) {
        throw new AppError("OTP has been expired", 400);
    }
    const otp = generateOTP();

    isUserExist.otp = otp;
    await isUserExist.save();
    const html = `
  <h1 style="text-align: center;">New Verification OTP</h1>
  <h1 style="text-align: center;">${otp}</h1>
  `;
    await SendEmail({
        to: isUserExist.email,
        subject: "Verification OTP",
        html,
    });
    res
        .status(201)
        .json({ message: "Verifification OTP has been sent", success: true });
});

export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const isUserExist = await userModel.findOne({ email }).select("+password");

    if (
        !isUserExist ||
        !isUserExist.isVerified ||
        isUserExist.authMethod === "google"
    ) {
        throw new AppError("Incorrect Credentials", 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError("Incorrect Credentials", 400);
    }
    const user = {
        _id: isUserExist._id.toString(),
        email: isUserExist.email,
        username: isUserExist.username,
        role: isUserExist.role,
    };
    const { accessToken, refreshToken } = await CreateTokensAndSession({
        _id: isUserExist._id.toString(),
        ip: req.ip ?? "unknown",
        userAgent: req.headers["user-agent"] ?? "unknown",
    });
    sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
    res.status(200).json({ message: "Login successful", accessToken, user });
});

export const googleController = asyncHandler(async (req, res) => {
    const {
        _json: { email, name, picture, ...rest },
    } = req.user;
    console.log(rest);

    const isUserExist = await userModel.findOne({ email });
    let refreshToken, accessToken;
    if (isUserExist) {
        // assigning accessToken,refreshToken values
        ({ refreshToken, accessToken } = await CreateTokensAndSession({
            _id: isUserExist._id.toString(),
            ip: req.ip ?? "unknown",
            userAgent: req.headers["user-agent"] ?? "unknown",
        }));
    } else {
        const newUser = await createUser({
            email,
            username: name,
            isVerified: true,
            profilePicture: picture,
        });
        // assigning accessToken,refreshToken values
        ({ refreshToken, accessToken } = await CreateTokensAndSession({
            _id: newUser._id.toString(),
            ip: req.ip ?? "unknown",
            userAgent: req.headers["user-agent"] ?? "unknown",
        }));
    }

    sendSecureCookie(res, "refreshToken", refreshToken, 24 * 60 * 60 * 1000);

    res.redirect(
        `${config.FRONTEND_URL}/auth/google/success?accessToken=${accessToken}`,
    );
});

export const verifyOtpController = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    let decoded = null;
    const token = req.cookies.tokenForOtp;
    decoded = getTokenData(token);
    if (!decoded._id || !decoded) {
        throw new AppError("Invalid token", 400);
    }
    const isUserExist = await userModel.findById(decoded._id);
    if (!isUserExist) {
        throw new AppError("User does not exist", 400);
    }
    if (
        !isUserExist.otp ||
        !isUserExist.otpExpiresIn ||
        isUserExist.otpExpiresIn.getTime() < Date.now()
    ) {
        throw new AppError("OTP has been expired", 400);
    }
    const isOTPCorrect = await bcrypt.compare(otp, isUserExist.otp);
    if (!isOTPCorrect) {
        throw new AppError("Incorrect OTP", 400);
    }

    isUserExist.otp = null;
    isUserExist.otpExpiresIn = null;
    isUserExist.isVerified = true;
    await isUserExist.save();

    const { accessToken, refreshToken } = await CreateTokensAndSession({
        _id: isUserExist._id.toString(),
        ip: req.ip ?? "unknown",
        userAgent: req.headers["user-agent"] ?? "unknown",
    });

    sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
    res.status(200).json({ message: "OTP verified successfully", accessToken });
});

export const meController = asyncHandler(async (req, res) => {
    let decoded;
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
        decoded = getTokenData(accessToken);
        if (!decoded || typeof decoded !== "object" || !decoded._id) {
            throw new AppError("Invalid token", 400);
        }
    } catch (error) {
        throw new AppError("Invalid token", 400);
    }
    const user = await userModel.findById(decoded._id);
    if (!user) {
        throw new AppError("User does not exist", 400);
    }
    res.status(200).json({ user });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError("Invalid token", 400);
    const decoded = getTokenData(token);
    const hashedOldRefreshToken = hashToken(token);
    const activeSession = await sessionModel.findOne({
        refreshToken: hashedOldRefreshToken,
        revoke: false,
    });
    if (!activeSession) {
        throw new AppError("Invalid token", 400);
    }
    if (typeof decoded !== "object" || !decoded || !decoded._id) {
        throw new AppError("Invalid token", 400);
    }
    const isUserExist = await userModel.findById(decoded._id);
    if (!isUserExist) {
        throw new AppError("User does not exist", 400);
    }

    const { accessToken, refreshToken } = await createTokensAndUpdateSession({
        _id: isUserExist._id.toString(),
        ip: req.ip ?? "unknown",
        userAgent: req.headers["user-agent"] ?? "unknown",
        oldRefreshToken: token,
    });
    sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
    res
        .status(200)
        .json({ message: "Token refreshed successfully", accessToken });
});

export const logoutController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) throw new AppError("Invalid token", 400);
    const decoded = getTokenData(refreshToken);
    if (!decoded || typeof decoded !== "object" || !decoded._id || !decoded.exp) {
        throw new AppError("Invalid token", 400);
    }
    if (accessToken) {
        const accesDecoded = getTokenData(accessToken);
        if (
            !accesDecoded ||
            typeof accesDecoded !== "object" ||
            !accesDecoded._id ||
            !accesDecoded.exp
        ) {
            throw new AppError("Invalid token", 400);
        }
        const now = Math.floor(Date.now() / 1000);
        const ttl = accesDecoded.exp - now;
        await redis.set(`blacklist:${accessToken}`, Date.now().toString(), {
            EX: ttl,
        });
    }
    const isUserExist = await userModel.findById(decoded._id);
    if (!isUserExist) {
        throw new AppError("User does not exist", 400);
    }
    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
    await sessionModel.findOneAndUpdate(
        { user: isUserExist._id, refreshToken: hashedRefreshToken },
        { revoke: true },
    );
    clearSecureCookie(res, "refreshToken");

    res.status(200).json({ message: "Logout successfully" });
});
export const logoutAllController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) throw new AppError("Invalid token", 400);

    const user = req.user;
    if (accessToken) {
        const accesDecoded = getTokenData(accessToken);
        if (
            !accesDecoded ||
            typeof accesDecoded !== "object" ||
            !accesDecoded._id ||
            !accesDecoded.exp
        ) {
            throw new AppError("Invalid token", 400);
        }
        const now = Math.floor(Date.now() / 1000);
        const ttl = accesDecoded.exp - now;
        await redis.set(`blacklist:${accessToken}`, Date.now().toString(), {
            EX: ttl,
        });
    }
    if (!user || !user._id) {
        throw new AppError("User does not exist", 400);
    }
    await sessionModel.updateMany(
        {
            user: user._id,
            revoke: false,
        },
        { revoke: true, revokedAt: new Date(), revokeReason: "logout" },
    );
    clearSecureCookie(res, "refreshToken");

    res
        .status(200)
        .json({ message: "Logout of All Devices Successfully successfully" });
});

export const forgetPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const isUserExist = await userModel.exists({ email });

    if (!isUserExist) throw new AppError("User does not exist", 400);
    const token = createTokenFromData({ email }, "5min");
    const html = `
    <h1 style="text-align: center;">Reset Password By Clicking The Button Below</h1>
    <a href=${config.FRONTEND_URL}/reset-password/${token} style="text-align: center;">Click Here<a/>
    `;
    await SendEmail({ to: email, html, subject: "Reset Password Link" }); // to,subject,text,html

    res
        .status(200)
        .json({ message: "email sent successfully with reset password link" });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;
    if (!token || typeof token !== "string")
        throw new AppError("Invalid token", 400);

    const isBlackListed = await redis.get(`blacklist:${token}`);
    if (isBlackListed) throw new AppError("Invalid token", 400);
    const decoded = getTokenData(token);
    if (!decoded || typeof decoded !== "object" || !decoded.email) {
        throw new AppError("Invalid token", 400);
    }
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const secondsRemaining = decoded.exp - currentTimeInSeconds;
    redis.set(`blacklist:${token}`, Date.now().toString(), {
        EX: secondsRemaining,
    });

    const isUserExist = await userModel.findOne({ email: decoded.email });
    if (!isUserExist) {
        throw new AppError("User does not exist", 400);
    }
    isUserExist.password = password;
    await isUserExist.save();
    res.status(200).json({ message: "Password reset successfully" });
});

export const changePasswordController = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (newPassword === oldPassword) {
        throw new AppError("New password cannot be same as old password", 400);
    }
    const isUserExist = await userModel.findById(req.user).select("+password");

    if (!isUserExist || !isUserExist.password) {
        throw new AppError("User does not exist", 400);
    }

    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        isUserExist.password,
    );

    if (!isPasswordMatch) {
        throw new AppError("Incorrect Password", 400);
    }

    isUserExist.password = newPassword;
    await isUserExist.save();

    res.status(200).json({
        message: "Password changed successfully",
    });
});
