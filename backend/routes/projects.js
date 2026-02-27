import express from "express";
import auth from "../middleware/auth.js";
import Photo from "../models/Photo.js";
import Project from "../models/Project.js";
import archiver from "archiver";
import axios from "axios";

const router = express.Router();

router.get("/", auth, async (_, res) => {
  res.json(await Project.find());
});

router.post("/", auth, async (req, res) => {
  res.json(await Project.create({ name: req.body.name }));
});

router.get("/:id/download", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  const photos = await Photo.find({ projectId: project._id });

  res.setHeader("Content-Disposition", `attachment; filename=${project.name}.zip`);
  const zip = archiver("zip");
  zip.pipe(res);

  for (const p of photos) {
    const img = await axios.get(p.imageUrl, { responseType: "stream" });
    zip.append(img.data, { name: `${p._id}.jpg` });
  }

  zip.finalize();
});

export default router;
