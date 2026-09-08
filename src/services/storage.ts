import { getSupabaseClient } from "@/lib/supabase"

type StorageFile = {
  bucket: string
  path: string
}

/**
 * Returns the stable URL for a file in a public Supabase Storage bucket.
 * Store only `path` (for example, `products/abc/front.webp`) in the database.
 */
export function getPublicStorageUrl({ bucket, path }: StorageFile): string {
  if (!bucket || !path) return ""

  const { data } = getSupabaseClient().storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Returns a temporary URL for a file in a private Supabase Storage bucket.
 */
export async function getSignedStorageUrl(
  { bucket, path }: StorageFile,
  expiresIn = 60 * 60
): Promise<string> {
  if (!bucket || !path) return ""

  const { data, error } = await getSupabaseClient().storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}
