import { Router } from "express";
import {
  registerController,
  loginController,
  googleController,
  meController,
  refreshTokenController,
  logoutController,
  verifyOtpController,
  resendOtpHandler,
  forgetPasswordController,
  resetPasswordController,
  changePasswordController,
  logoutAllController,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { authLimiter, otpLimiter } from "../Limiters/auth.limiters.js";
import {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";
const authRouter = Router();

/**
 * @post Register
 * @body {email ,password ,username}
 * @return {success,message}
 * @description register user and send otp for verification
 */
authRouter.post(
  "/register",
  registerValidator,
  authLimiter,
  registerController,
);
/**
 * @post Login
 * @body {email ,password}
 * @return {success,message}
 * @description login user
 */
authRouter.post("/login", loginValidator, authLimiter, loginController);
/**
 * @post Resend Otp
 * @return {success,message}
 * @description resend otp for verification
 */
authRouter.get("/resend-otp", otpLimiter, resendOtpHandler);

/**
 * @post Verify Otp
 * @body {otp}
 * @return {success,message}
 * @description verify otp of the user whose id is in the token
 */
authRouter.post("/verify-otp", otpLimiter, verifyOtpController);
/**
 * @get google
 * @return {success,message}
 * @description login with google
 */
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
/**
 * @get google/callback
 * @return {success,message}
 * @description login with google
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authLimiter,
  googleController,
);
/**
 * @get me
 * @return {success,message}
 * @description get user details from the accessToken provided from frotnend
 */
authRouter.get("/me", meController);
/**
 * @get refresh-token
 * @return {success,message}
 * @description rotate tokens access Token and Refresh Token and update session
 */
authRouter.get("/refresh-token", authLimiter, refreshTokenController);

/**
 * @get logout
 * @return {success,message}
 * @description logout user and revoke session
 */
authRouter.get("/logout", authLimiter, logoutController);
/**
 * @get logout-all
 * @return {success,message}
 * @description logout out from other devices and revoke all sessions
 */
authRouter.get("/logout-all", isUserVerified, logoutAllController);
/**
 * @post forgetPassword
 * @body {email}
 * @return {success,message}
 * @description send email to reset password
 */
authRouter.post("/forget-password", forgetPasswordController);
/**
 * @post resetPassword
 * @body {password}
 * @return {success,message}
 * @description reset password
 */
authRouter.post(
  "/reset-password/:token",
  resetPasswordValidator,
  resetPasswordController,
);
/**
 * @post changePassword
 * @body {newPassword,oldPassword}
 * @return {success,message}
 * @description change password of the user logged in using req.user
 */
authRouter.post(
  "/change-password",
  authLimiter,
  isUserVerified,
  changePasswordController,
);


export default authRouter;
