import express from "express";
import auth from "../middleware/auth.js";
import Photo from "../models/Photo.js";

const router = express.Router();

router.get("/:projectId", auth, async (req, res) => {
  res.json(await Photo.find({ projectId: req.params.projectId }));
});

router.delete("/:id", auth, async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
