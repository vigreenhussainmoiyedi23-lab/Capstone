import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "process";

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Handle user authentication and profile retrieval
    return done(null, profile);
}));

app.use("/", authRouter)


export default app;