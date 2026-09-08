create table public.product_stocks (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  quantity_available integer generated always as (
    quantity_on_hand - quantity_reserved
  ) stored,
  reorder_level integer not null default 0 check (reorder_level >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_stocks_reservation_limit check (
    quantity_reserved <= quantity_on_hand
  )
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id text,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  payment_status text not null default 'unpaid' check (
    payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded')
  ),
  currency text not null default 'myr' check (currency ~ '^[a-z]{3}$'),
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  shipping_total numeric(12, 2) not null default 0 check (shipping_total >= 0),
  discount_total numeric(12, 2) not null default 0 check (discount_total >= 0),
  grand_total numeric(12, 2) not null default 0 check (grand_total >= 0),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  notes text,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A one-to-one snapshot of the customer's contact and delivery information at
-- checkout. It is intentionally separate from a reusable customer profile so
-- historical orders do not change when a customer later edits their address.
create table public.customer_order_details (
  order_id uuid primary key references public.orders(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country_code text not null default 'MY' check (country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Line items are required to represent the many-to-many relationship between
-- orders and products. Product name and price are snapshots for order history.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12, 2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now(),
  unique (order_id, product_id)
);

create index orders_customer_created_idx
  on public.orders (customer_id, created_at desc)
  where customer_id is not null;

create index orders_status_created_idx
  on public.orders (status, created_at desc);

create index order_items_product_idx
  on public.order_items (product_id);

create trigger product_stocks_set_updated_at
before update on public.product_stocks
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger customer_order_details_set_updated_at
before update on public.customer_order_details
for each row execute function public.set_updated_at();

alter table public.product_stocks enable row level security;
alter table public.orders enable row level security;
alter table public.customer_order_details enable row level security;
alter table public.order_items enable row level security;

-- Catalog clients may display availability for active products. Order and
-- customer tables deliberately have no browser policies and are accessed only
-- by the trusted Node.js backend.
create policy "Anyone can read stock for active products"
on public.product_stocks
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_stocks.product_id
      and products.is_active = true
  )
);

