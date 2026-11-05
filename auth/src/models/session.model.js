import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    revoke: { type: Boolean, default: false },
    revokedAt: { type: Date, default: null },
    revokeReason: {
      type: String,
      enum: ["logout", "admin", "password_change", "expired"],
      default: "logout",
    },
  },
  { timestamps: true },
);
sessionSchema.index({ user: 1, refreshToken: 1 });
const sessionModel = mongoose.model("session", sessionSchema);

export default sessionModel;
