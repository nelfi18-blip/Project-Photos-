import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
 copilot/create-fotos-proyectos-table

import { API } from "../services/api";
 main
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setError("");
 copilot/create-fotos-proyectos-table
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/fotos` },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      try {
        await supabase.auth.signInWithPassword({ email, password });
      } catch {
        // Supabase session is best-effort; backend auth already succeeded
      }
      navigate("/projects");
    } catch {
      setError("Connection error");
 main
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card w-full max-w-sm text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm">
            We sent a magic link to <strong>{email}</strong>.<br />
            Click the link to access Naam Construction photo docs.
          </p>
          <button
            onClick={() => setSent(false)}
            className="btn-secondary btn-block mt-6"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📸</div>
          <h1 className="text-2xl font-bold">Naam Construction</h1>
          <p className="text-gray-500 text-sm mt-1">Project photo documentation</p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-block"
          >
            {loading ? "Sending…" : "Send magic link"}
          </button>
        </form>
      </div>
    </div>
  );
}
