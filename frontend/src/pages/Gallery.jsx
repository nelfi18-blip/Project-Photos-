import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, auth } from "../services/api";
import { supabase } from "../services/supabase";

export default function Gallery() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const navigate = useNavigate();

  const [uploadError, setUploadError] = useState("");

  const load = async () => {
    const res = await fetch(`${API}/photos/${id}`, { headers: auth() });
    setPhotos(await res.json());
  };

  useEffect(() => { load(); }, [id]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");

    let user = null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error) user = data.user;
    } catch {
      // ignore, user remains null
    }

    if (user) {
      const nameParts = file.name.split(".");
      const ext = nameParts.length > 1 ? nameParts.pop() : "jpg";
      const path = `${user.id}/${Date.now()}_obra.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("proyectos-fotos")
        .upload(path, file);

      if (storageError) {
        setUploadError(`Storage error: ${storageError.message}`);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("proyectos-fotos")
          .getPublicUrl(path);

        const res = await fetch(`${API}/photos`, {
          method: "POST",
          headers: { ...auth(), "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id, imageUrl: publicUrl })
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setUploadError(body.error || "Failed to save photo record. Please try again.");
        }
      }
    } else {
      setUploadError("You must be logged in to upload photos.");
    }

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
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
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
