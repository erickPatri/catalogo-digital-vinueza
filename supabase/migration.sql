-- ============================================================
-- Migración Supabase — Creaciones Vinueza
-- Ejecutar este script en el SQL Editor de Supabase
-- (Dashboard > SQL Editor > New Query > Pegar y ejecutar)
-- ============================================================

-- 1. TABLA DE PRODUCTOS
-- ============================================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  price numeric(10, 2) not null check (price > 0),
  category text not null,
  image_url text default '',
  visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para consultas frecuentes (catálogo público)
create index if not exists idx_products_visible on public.products (visible);
create index if not exists idx_products_category on public.products (category);

-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Habilitar RLS en la tabla products
alter table public.products enable row level security;

-- Política: Cualquier persona puede LEER productos (catálogo público)
create policy "Lectura pública de productos"
  on public.products
  for select
  using (true);

-- Política: Solo usuarios autenticados pueden INSERTAR productos
create policy "Solo admin puede insertar"
  on public.products
  for insert
  to authenticated
  with check (true);

-- Política: Solo usuarios autenticados pueden ACTUALIZAR productos
create policy "Solo admin puede actualizar"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

-- Política: Solo usuarios autenticados pueden ELIMINAR productos
create policy "Solo admin puede eliminar"
  on public.products
  for delete
  to authenticated
  using (true);

-- 3. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_products_update
  before update on public.products
  for each row
  execute function public.handle_updated_at();

-- 4. BUCKET DE STORAGE PARA IMÁGENES
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Política: Cualquier persona puede VER las imágenes (son públicas)
create policy "Imágenes públicas de lectura"
  on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Política: Solo usuarios autenticados pueden SUBIR imágenes
create policy "Solo admin sube imágenes"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Política: Solo usuarios autenticados pueden ACTUALIZAR imágenes
create policy "Solo admin actualiza imágenes"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images');

-- Política: Solo usuarios autenticados pueden ELIMINAR imágenes
create policy "Solo admin elimina imágenes"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- ¡Listo! Ahora la base de datos y el storage están configurados.
-- ============================================================
