import dotenv from "dotenv";
import { ConnectToDB } from "./src/config/mongoConnection";

dotenv.config();

ConnectToDB();
