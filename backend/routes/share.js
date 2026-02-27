import express from "express";
import crypto from "crypto";
import ShareLink from "../models/ShareLink.js";
import Photo from "../models/Photo.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + 7 * 86400000);

  await ShareLink.create({ projectId: req.params.id, token, expiresAt: expires });
  res.json({ url: `/share/${token}` });
});

router.get("/:token", async (req, res) => {
  const link = await ShareLink.findOne({ token: req.params.token });
  if (!link || new Date() > link.expiresAt) return res.sendStatus(403);
  res.json(await Photo.find({ projectId: link.projectId }));
});

export default router;
