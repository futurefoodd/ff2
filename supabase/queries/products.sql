-- Product listing with ordered images as JSON.
select
  p.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', pi.id,
        'storage_path', pi.storage_path,
        'alt_text', pi.alt_text,
        'is_primary', pi.is_primary,
        'sort_order', pi.sort_order
      ) order by pi.is_primary desc, pi.sort_order, pi.id
    ) filter (where pi.id is not null),
    '[]'::jsonb
  ) as images
from public.products p
left join public.product_images pi on pi.product_id = p.id
where p.is_active = true
group by p.id
order by p.sort_order, p.id;

-- One product and its ordered images.
-- Replace 'your-product-slug' or bind this value in your database client.
select p.*, pi.*
from public.products p
left join public.product_images pi on pi.product_id = p.id
where p.slug = 'your-product-slug'
  and p.is_active = true
order by pi.is_primary desc, pi.sort_order, pi.id;
