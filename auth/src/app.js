import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/status/readyz", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});



passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_SECRET_KEY,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use("/api/auth", authRouter)


export default app;