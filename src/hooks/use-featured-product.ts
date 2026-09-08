import { useQuery } from "@tanstack/react-query"

import { fetchFeaturedProduct } from "@/services/products"
import { productsQueryKey } from "@/hooks/use-products"

export function useFeaturedProduct() {
  return useQuery({
    queryKey: [...productsQueryKey, "featured"],
    queryFn: fetchFeaturedProduct,
    staleTime: 5 * 60 * 1000,
  })
}
