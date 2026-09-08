-- `product-images` is a public bucket, so it serves direct asset URLs without
-- a storage.objects SELECT policy. Removing the broad policy prevents clients
-- from listing object metadata for the entire bucket.
drop policy if exists "Anyone can read product image objects" on storage.objects;
