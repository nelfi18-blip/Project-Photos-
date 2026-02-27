import mongoose from "mongoose";

export default mongoose.model("Photo", new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
}));
