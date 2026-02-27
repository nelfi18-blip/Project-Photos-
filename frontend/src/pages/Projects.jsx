import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, auth } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const res = await fetch(`${API}/projects`, { headers: auth() });
    setProjects(await res.json());
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await fetch(`${API}/projects`, {
      method: "POST",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setName("");
    load();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Projects</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Create</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((p) => (
          <li
            key={p._id}
            onClick={() => navigate(`/projects/${p._id}`)}
            style={{ padding: 12, border: "1px solid #ccc", marginBottom: 8, cursor: "pointer" }}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
