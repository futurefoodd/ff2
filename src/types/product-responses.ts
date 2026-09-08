export type ProductImageResponse = {
  id: string
  type: "image"
  storagePath: string
  url: string
  alt: string
}

export type ProductSummaryResponse = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  isFeatured: boolean
  image: ProductImageResponse | null
}

export type ProductSpecificationResponse = {
  label: string
  value: string
}

export type ProductNutrientResponse = {
  nutrient: string
  amount: string
  dailyValue: string
}

export type ProductDetailResponse = ProductSummaryResponse & {
  longDescription: string
  hasVideo: boolean
  videoUrl: string | null
  images: ProductImageResponse[]
  specs: ProductSpecificationResponse[]
  nutrients: ProductNutrientResponse[]
}
