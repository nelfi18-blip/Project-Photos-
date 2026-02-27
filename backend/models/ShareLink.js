import mongoose from "mongoose";

export default mongoose.model("ShareLink", new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  token: String,
  expiresAt: Date
}));
