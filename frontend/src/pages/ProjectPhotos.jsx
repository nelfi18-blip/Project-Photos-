import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function ProjectPhotos() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('Login error:', error);
      alert('No se pudo enviar el enlace. Por favor, inténtalo de nuevo.');
    } else {
      alert('¡Revisa tu email para el enlace de acceso!');
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    let filePath = null;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('proyectos-fotos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('proyectos-fotos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('fotos_proyectos').insert({
        url_foto: publicUrl,
        nombre_proyecto: projectName || 'Sin nombre',
        subido_por: user.id,
      });

      if (dbError) {
        await supabase.storage.from('proyectos-fotos').remove([filePath]);
        throw dbError;
      }

      alert('¡Foto subida con éxito!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('No se pudo subir la foto. Por favor, inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
        <h2>Project Photos – Acceso</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 8, padding: 8, boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: 10 }}>
            Enviar enlace de acceso
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Project Photos</h2>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8, boxSizing: 'border-box' }}
        />
        <label htmlFor="photo-upload" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', cursor: 'pointer', display: 'inline-block' }}>
          {uploading ? 'Subiendo…' : 'Subir Foto'}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={uploadPhoto}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <p style={{ color: '#555', fontSize: 14 }}>
        Sesión iniciada como: {user.email}
      </p>
    </div>
  );
}
