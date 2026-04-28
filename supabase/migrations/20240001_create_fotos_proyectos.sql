-- ============================================================
-- Migration: create fotos_proyectos table + proyectos-fotos bucket
-- Paste this entire file in the Supabase SQL Editor and run it.
-- ============================================================

-- 1. Table -------------------------------------------------------
create table fotos_proyectos (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url_foto text not null,
  nombre_proyecto text,
  subido_por uuid references auth.users(id)
);

-- Habilitar seguridad
alter table fotos_proyectos enable row level security;

create policy "Lectura para todos" on fotos_proyectos for select using (true);
create policy "Inserción para autenticados" on fotos_proyectos for insert with check (auth.uid() = subido_por);


-- 2. Storage bucket ----------------------------------------------
-- Create the storage bucket 'proyectos-fotos' (public so images load without signed URLs)
insert into storage.buckets (id, name, public)
values ('proyectos-fotos', 'proyectos-fotos', true)
on conflict (id) do nothing;

-- Anyone can read objects in the bucket (needed for <img src="...">)
create policy "Public read proyectos-fotos"
  on storage.objects for select
  using (bucket_id = 'proyectos-fotos');

-- Authenticated users can upload
create policy "Authenticated upload proyectos-fotos"
  on storage.objects for insert
  with check (
    bucket_id = 'proyectos-fotos'
    and auth.role() = 'authenticated'
  );

-- Authenticated users can delete their own uploads
create policy "Authenticated delete proyectos-fotos"
  on storage.objects for delete
  using (
    bucket_id = 'proyectos-fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- 2. Storage bucket ----------------------------------------------
-- Create the storage bucket 'proyectos-fotos' (public so images load without signed URLs)
insert into storage.buckets (id, name, public)
values ('proyectos-fotos', 'proyectos-fotos', true)
on conflict (id) do nothing;

-- Anyone can read objects in the bucket (needed for <img src="...">)
create policy "Public read proyectos-fotos"
  on storage.objects for select
  using (bucket_id = 'proyectos-fotos');

-- Authenticated users can upload
create policy "Authenticated upload proyectos-fotos"
  on storage.objects for insert
  with check (
    bucket_id = 'proyectos-fotos'
    and auth.role() = 'authenticated'
  );

-- Authenticated users can delete their own uploads
create policy "Authenticated delete proyectos-fotos"
  on storage.objects for delete
  using (
    bucket_id = 'proyectos-fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
