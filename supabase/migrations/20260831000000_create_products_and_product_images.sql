create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  description text not null default '',
  long_description text not null default '',
  has_video boolean not null default false,
  video_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint product_images_storage_path_format check (
    storage_path <> ''
    and storage_path !~ '^/'
    and storage_path !~ '(^|/)\.\.(/|$)'
  ),
  unique (product_id, sort_order)
);

create index if not exists products_active_sort_idx
  on public.products (sort_order, id)
  where is_active = true;

create index if not exists product_images_product_sort_idx
  on public.product_images (product_id, sort_order, id);

create unique index if not exists product_images_one_primary_idx
  on public.product_images (product_id)
  where is_primary = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Anyone can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy "Anyone can read images of active products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
);

-- Product images are public catalog assets. The application stores paths such as
-- `<product-id>/front.webp`, not full Supabase URLs.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Anyone can read product image objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

