import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      aria-busy="true"
      className="mt-12"
    >
      <span className="sr-only">Loading products…</span>
      <div
        aria-hidden="true"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <Card key={index} className="h-full rounded-3xl py-0">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2 pb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      aria-busy="true"
      className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <span className="sr-only">Loading product details…</span>
      <Skeleton className="aspect-square w-full rounded-4xl" />
      <div aria-hidden="true" className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-4/5" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full rounded-3xl" />
      </div>
    </div>
  )
}

export function FeaturedProductSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading featured product"
      aria-busy="true"
      className="grid gap-10 lg:grid-cols-2 lg:items-center"
    >
      <span className="sr-only">Loading featured product…</span>
      <Skeleton className="aspect-4/3 min-h-80 w-full rounded-4xl" />
      <div aria-hidden="true" className="max-w-xl space-y-6 px-6 py-6">
        <Skeleton className="h-4 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
    </div>
  )
}
