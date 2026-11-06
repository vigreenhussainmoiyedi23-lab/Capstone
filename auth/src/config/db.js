import mongoose from "mongoose";
import { config } from "./config.js";


export async function ConnectToDB(retryCount = 0) {
    try {
        await mongoose.connect(config.MONGO_URI)
    } catch (error) {
        if (retryCount < 5) {
            console.log(`Retrying to connect to MongoDB... Attempt ${retryCount + 1}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return ConnectToDB(retryCount + 1);
        } else {
            console.error("Error connecting to MongoDB:", error);
        }
    }
}

