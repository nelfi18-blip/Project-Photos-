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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/projects")} className="btn-secondary text-xs px-3 py-2">
            ← Back
          </button>
          <h1 className="text-lg font-bold">🖼️ Gallery</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <label className={`btn-primary justify-center ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {uploading ? "Uploading…" : (
              <span className="flex items-center gap-1"><span>📷</span> Upload</span>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={upload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button onClick={download} className="btn-secondary text-sm">
            ⬇ ZIP
          </button>
          <button onClick={share} className="btn-secondary text-sm">
            🔗 Share
          </button>
        </div>

        {uploadError && (
          <div className="card text-red-500 text-sm">
            {uploadError}
          </div>
        )}

        {shareUrl && (
          <div className="card text-sm break-all">
            <span className="font-medium text-gray-600">Share URL: </span>
            <a href={shareUrl} className="text-brand underline">{shareUrl}</a>
          </div>
        )}

        {/* Photo grid */}
        {photos.length === 0 ? (
          <div className="card text-center text-gray-400 py-12">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">No photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((p) => (
              <div key={p._id} className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100">
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => remove(p._id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
