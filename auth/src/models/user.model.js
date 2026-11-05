import { Schema, model } from "mongoose";

const userSchema = new Schema({
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String
    }
});
userSchema.index({ email: 1 }, { unique: true });

const userModel = model("user", userSchema);
export default userModel