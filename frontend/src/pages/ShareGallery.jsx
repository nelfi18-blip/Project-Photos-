import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../services/api";

export default function ShareGallery() {
  const { token } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/share/${token}`)
      .then((res) => {
        if (!res.ok) { setError("Link expired or invalid"); return []; }
        return res.json();
      })
      .then((data) => setPhotos(data));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card text-center p-8">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold">🔗 Shared Gallery</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {photos.length === 0 ? (
          <div className="card text-center text-gray-400 py-12">
            <p className="text-sm">No photos in this gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((p) => (
              <img
                key={p._id}
                src={p.imageUrl}
                alt=""
                className="w-full h-36 object-cover rounded-xl border border-gray-100 shadow-sm"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
