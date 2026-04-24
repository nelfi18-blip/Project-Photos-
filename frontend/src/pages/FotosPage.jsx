import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const BUCKET = "proyectos-fotos";
const TABLE = "fotos_proyectos";

export default function FotosPage() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadPhotos = useCallback(async () => {
    const { data, error: err } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!err) setPhotos(data ?? []);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !projectName.trim()) {
      setError("Please enter a project name before taking a photo.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      // Upload to storage bucket
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      // Insert row in fotos_proyectos
      const { error: insertErr } = await supabase.from(TABLE).insert({
        proyecto_nombre: projectName.trim(),
        storage_path: path,
        image_url: urlData.publicUrl,
        uploaded_by: user.email,
      });

      if (insertErr) throw insertErr;

      await loadPhotos();
    } catch (err) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold leading-tight">📸 Naam Construction</h1>
            {user && <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>}
          </div>
          <button onClick={handleSignOut} className="btn-secondary text-xs px-3 py-2">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Upload section */}
        <section className="card space-y-4">
          <h2 className="font-semibold text-base">Document work</h2>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Project / location
            </label>
            <input
              id="project"
              type="text"
              placeholder="e.g. Site A – Foundation"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <label className={`btn-primary btn-block ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-lg">📷</span> Take / choose photo
              </span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-400 text-center">
            Opens the rear camera on mobile devices
          </p>
        </section>

        {/* Gallery section – last 10 photos */}
        <section>
          <h2 className="font-semibold text-base mb-3">Recent photos (last 10)</h2>

          {photos.length === 0 ? (
            <div className="card text-center text-gray-400 py-10">
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-sm">No photos yet. Upload the first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                  <img
                    src={photo.image_url}
                    alt={photo.proyecto_nombre}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{photo.proyecto_nombre}</p>
                    <p className="text-xs text-gray-400 truncate">{photo.uploaded_by}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
