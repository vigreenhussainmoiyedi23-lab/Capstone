if (!process.env.GOOGLE_USER) throw new Error("GOOGLE_USER env var is required");
if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID env var is required");
if (!process.env.GOOGLE_SECRET_KEY) throw new Error("GOOGLE_SECRET_KEY env var is required");
if (!process.env.GOOGLE_REFRESH_TOKEN) throw new Error("GOOGLE_REFRESH_TOKEN env var is required");



export const config = {
    GOOGLE_USER: process.env.GOOGLE_USER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN
}