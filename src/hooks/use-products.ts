import { useQuery } from "@tanstack/react-query"

import { fetchProductBySlug, fetchProducts } from "@/services/products"

export const productsQueryKey = ["products"] as const

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: [...productsQueryKey, "detail", slug],
    queryFn: () => (slug ? fetchProductBySlug(slug) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000,
  })
}
