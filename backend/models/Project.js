import mongoose from "mongoose";

export default mongoose.model("Project", new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
}));
