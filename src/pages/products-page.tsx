import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { TopNavigation } from "@/components/top-navigation"
import { ProductsSkeleton } from "@/components/product-skeletons"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/use-products"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function ProductImagePlaceholder({ productName }: { productName: string }) {
  return (
    <div className="grid aspect-4/3 place-items-center bg-linear-to-br from-primary/20 via-muted to-primary/5">
      <span className="flex flex-col items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <ImageIcon className="size-7" />
        {productName} image
      </span>
    </div>
  )
}

export function ProductsPage() {
  const { data, isPending, error, refetch, isFetching } = useProducts()
  const products = data ?? []

  return (
    <div className="min-h-svh bg-background">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Products
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Find the right support for your routine
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Explore our collection of products, each designed to make everyday
            wellness feel more achievable.
          </p>
        </div>

        {isPending ? (
          <ProductsSkeleton />
        ) : error && data === undefined ? (
          <div className="mt-12 space-y-4">
            <p className="text-destructive" role="alert">
              Unable to load products. Please try again.
            </p>
            <Button onClick={() => void refetch()} disabled={isFetching}>
              Try again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            No products are available right now.
          </p>
        ) : (
          <section
            aria-label="Product listing"
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="block"
              >
                <Card className="h-full rounded-3xl py-0 transition-shadow hover:shadow-lg">
                  {product.image ? (
                    <img
                      src={product.image.url}
                      alt={product.image.alt || product.name}
                      className="aspect-4/3 w-full object-cover"
                    />
                  ) : (
                    <ProductImagePlaceholder productName={product.name} />
                  )}
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-6">
                      {product.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
