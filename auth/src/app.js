import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import googleRouter from "./routes/google.route.js";
import passport from "passport";


const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Handle user authentication and profile retrieval
    return done(null, profile);
}));

app.use("/google", googleRouter)



export default app;