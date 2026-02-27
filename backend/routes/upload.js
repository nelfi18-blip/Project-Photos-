import express from "express";
import fs from "fs";
import multer from "multer";
import cloudinary from "cloudinary";
import Photo from "../models/Photo.js";
import auth from "../middleware/auth.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      transformation: [{
        overlay: {
          font_family: "Arial",
          font_size: 30,
          text: "ProjectPhotos"
        },
        gravity: "south_east",
        opacity: 60
      }]
    });

    fs.unlink(req.file.path, () => {});

    await Photo.create({
      projectId: req.body.projectId,
      imageUrl: result.secure_url
    });

    res.json({ ok: true });
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
