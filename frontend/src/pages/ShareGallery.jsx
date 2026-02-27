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

  if (error) return <p style={{ textAlign: "center", marginTop: 80 }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <h2>Shared Gallery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {photos.map((p) => (
          <img key={p._id} src={p.imageUrl} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />
        ))}
      </div>
    </div>
  );
}
