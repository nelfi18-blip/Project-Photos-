import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import ShareGallery from "./pages/ShareGallery";
import FotosPage from "./pages/FotosPage";
import ProjectPhotos from "./pages/ProjectPhotos";
import { supabase } from "./services/supabase";

// Handles the magic-link redirect from Supabase
function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? "/fotos" : "/login", { replace: true });
    });
  }, [navigate]);
  return <div role="status" aria-live="polite" className="text-center mt-20 text-gray-400">Signing you in…</div>;
}

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/fotos" element={<FotosPage />} />
        <Route path="/project-photos" element={<ProjectPhotos />} />
        <Route path="/share/:token" element={<ShareGallery />} />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <Gallery />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
