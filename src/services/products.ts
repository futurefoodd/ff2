import { env } from "@/config/env"
import { getSupabaseClient } from "@/lib/supabase"
import { getPublicStorageUrl } from "@/services/storage"
import type { Tables } from "@/types/supabase.generated"
import type {
  ProductDetailResponse,
  ProductImageResponse,
  ProductSummaryResponse,
} from "@/types/product-responses"

type ProductRow = Tables<"products">
type ProductImageRow = Tables<"product_images">
type ProductWithImages = ProductRow & { product_images: ProductImageRow[] }

const productSelection = "*, product_images(*)" as const

function mapImage(image: ProductImageRow): ProductImageResponse {
  return {
    id: image.id,
    type: "image",
    storagePath: image.storage_path,
    url: getPublicStorageUrl({
      bucket: env.SUPABASE_PRODUCT_IMAGES_BUCKET,
      path: image.storage_path,
    }),
    alt: image.alt_text,
  }
}

function orderedImages(product: ProductWithImages) {
  return [...product.product_images]
    .sort(
      (left, right) =>
        Number(right.is_primary) - Number(left.is_primary) ||
        left.sort_order - right.sort_order ||
        left.id.localeCompare(right.id)
    )
    .map(mapImage)
}

function mapSummary(product: ProductWithImages): ProductSummaryResponse {
  const images = orderedImages(product)
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    isFeatured: product.is_featured,
    image: images[0] ?? null,
  }
}

function mapDetail(product: ProductWithImages): ProductDetailResponse {
  const images = orderedImages(product)
  return {
    ...mapSummary(product),
    image: images[0] ?? null,
    longDescription: product.long_description,
    hasVideo: product.has_video,
    videoUrl: product.video_url,
    images,
    specs: [],
    nutrients: [],
  }
}

export async function fetchProducts(): Promise<ProductSummaryResponse[]> {
  const { data, error } = await getSupabaseClient()
    .from("products")
    .select(productSelection)
    .eq("is_active", true)
    .order("sort_order")
    .order("id")

  if (error) throw error
  return data.map((product) => mapSummary(product as ProductWithImages))
}

export async function fetchFeaturedProduct(): Promise<ProductSummaryResponse | null> {
  const { data, error } = await getSupabaseClient()
    .from("products")
    .select(productSelection)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data ? mapSummary(data as ProductWithImages) : null
}

export async function fetchProductBySlug(
  slug: string
): Promise<ProductDetailResponse | null> {
  const { data, error } = await getSupabaseClient()
    .from("products")
    .select(productSelection)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (error) throw error
  return data ? mapDetail(data as ProductWithImages) : null
}
