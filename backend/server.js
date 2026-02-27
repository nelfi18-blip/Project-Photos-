import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import uploadRoutes from "./routes/upload.js";
import photoRoutes from "./routes/photos.js";
import shareRoutes from "./routes/share.js";

const app = express();
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

mongoose.connect(process.env.MONGO_URI).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.use("/auth", authLimiter, authRoutes);
app.use("/projects", apiLimiter, projectRoutes);
app.use("/upload", apiLimiter, uploadRoutes);
app.use("/photos", apiLimiter, photoRoutes);
app.use("/share", apiLimiter, shareRoutes);

app.listen(4000, () => console.log("Backend running"));
