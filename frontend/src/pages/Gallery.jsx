import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, auth } from "../services/api";

export default function Gallery() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const res = await fetch(`${API}/photos/${id}`, { headers: auth() });
    setPhotos(await res.json());
  };

  useEffect(() => { load(); }, [id]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("image", file);
    form.append("projectId", id);
    await fetch(`${API}/upload`, { method: "POST", headers: auth(), body: form });
    setUploading(false);
    load();
  };

  const remove = async (photoId) => {
    await fetch(`${API}/photos/${photoId}`, { method: "DELETE", headers: auth() });
    load();
  };

  const download = () => {
    window.location.href = `${API}/projects/${id}/download?token=${localStorage.getItem("token")}`;
  };

  const share = async () => {
    const res = await fetch(`${API}/share/${id}`, { method: "POST" });
    const data = await res.json();
    setShareUrl(`${window.location.origin}${data.url}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <button onClick={() => navigate("/projects")} style={{ marginBottom: 16 }}>
        ← Back
      </button>
      <h2>Gallery</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <label style={{ padding: "8px 16px", background: "#007bff", color: "#fff", cursor: "pointer" }}>
          {uploading ? "Uploading…" : "Upload Photo"}
          <input type="file" accept="image/*" onChange={upload} style={{ display: "none" }} />
        </label>
        <button onClick={download}>Download ZIP</button>
        <button onClick={share}>Share Link</button>
      </div>
      {shareUrl && (
        <p>
          Share URL: <a href={shareUrl}>{shareUrl}</a>
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {photos.map((p) => (
          <div key={p._id} style={{ position: "relative" }}>
            <img src={p.imageUrl} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <button
              onClick={() => remove(p._id)}
              style={{ position: "absolute", top: 4, right: 4, background: "red", color: "#fff", border: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
