import express from "express";
import auth from "../middleware/auth.js";
import Photo from "../models/Photo.js";

const router = express.Router();

router.get("/:projectId", auth, async (req, res) => {
  res.json(await Photo.find({ projectId: req.params.projectId }));
});

router.post("/", auth, async (req, res) => {
  const { projectId, imageUrl } = req.body;
  if (!projectId || !imageUrl) {
    return res.status(400).json({ error: "projectId and imageUrl are required" });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const parsed = new URL(imageUrl);
      const allowed = new URL(supabaseUrl);
      if (parsed.hostname !== allowed.hostname) {
        return res.status(400).json({ error: "Invalid imageUrl domain" });
      }
    } catch {
      return res.status(400).json({ error: "Invalid imageUrl" });
    }
  }
  let photo;
  try {
    photo = await Photo.create({ projectId, imageUrl });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save photo record" });
  }
  res.json(photo);
});

router.delete("/:id", auth, async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
