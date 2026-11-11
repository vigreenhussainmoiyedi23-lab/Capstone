import mongoose from "mongoose";

export async function ConnectToDb(retry = 0) {
    try {
        await mongoose.connect(process.env.SANDBOX_MONGO_URI);
    } catch (error) {
        if (retry < 5) {
            console.log("Error Trying TO connect to DATABASE RETRYING.... " + 5 - retry + " left");
            ConnectToDb(retry + 1)
        }
        else {
            throw new Error("Failed to connect to DATABASE");
        }
    }
}
