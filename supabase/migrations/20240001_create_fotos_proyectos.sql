-- ============================================================
-- Migration: create fotos_proyectos table + proyectos-fotos bucket
-- Paste this entire file in the Supabase SQL Editor and run it.
-- ============================================================

-- 1. Table -------------------------------------------------------
create table if not exists public.fotos_proyectos (
  id            uuid primary key default gen_random_uuid(),
  proyecto_nombre text not null,
  storage_path  text not null,
  image_url     text not null,
  uploaded_by   text,                  -- user email
  created_at    timestamptz not null default now()
);

-- Index for the gallery query (last 10 by date)
create index if not exists fotos_proyectos_created_at_idx
  on public.fotos_proyectos (created_at desc);

-- Row-Level Security (RLS) – enable but allow anon read and authenticated insert
alter table public.fotos_proyectos enable row level security;

-- Anyone (including anon) can read the photos
create policy "Public read fotos_proyectos"
  on public.fotos_proyectos for select
  using (true);

-- Only authenticated users can insert
create policy "Authenticated insert fotos_proyectos"
  on public.fotos_proyectos for insert
  with check (auth.role() = 'authenticated');

-- Only the uploader can delete their own photos
create policy "Owner delete fotos_proyectos"
  on public.fotos_proyectos for delete
  using (auth.email() = uploaded_by);


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
