import dotenv from "dotenv";
import { ConnectToDB } from "./src/config/db";
import app from "./src/app";

dotenv.config();
await ConnectToDB();


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});