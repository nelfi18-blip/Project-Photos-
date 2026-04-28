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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">📁 Projects</h1>
          <button onClick={logout} className="btn-secondary text-xs px-3 py-2">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <form onSubmit={create} className="flex gap-2">
          <input
            placeholder="New project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Create
          </button>
        </form>

        <ul className="space-y-2">
          {projects.map((p) => (
            <li
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              className="card flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="font-medium">{p.name}</span>
              <span className="text-gray-400 text-lg">›</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
