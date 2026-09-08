import { ArrowRight, ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { FeaturedProductSkeleton } from "@/components/product-skeletons"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFeaturedProduct } from "@/hooks/use-featured-product"

export function FeaturedProduct() {
  const {
    data: product,
    isPending,
    error,
    refetch,
    isFetching,
  } = useFeaturedProduct()

  return (
    <section
      id="products"
      aria-label="Featured product"
      className="mx-auto max-w-7xl px-6 py-20 lg:px-12"
    >
      {isPending ? (
        <FeaturedProductSkeleton />
      ) : error && product === undefined ? (
        <div className="space-y-4">
          <p role="alert" className="text-destructive">
            Unable to load the featured product.
          </p>
          <Button onClick={() => void refetch()} disabled={isFetching}>
            Try again
          </Button>
        </div>
      ) : product ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {product.image ? (
            <img
              src={product.image.url}
              alt={product.image.alt || product.name}
              loading="lazy"
              width={800}
              height={600}
              className="aspect-4/3 min-h-80 w-full rounded-4xl bg-muted object-contain"
            />
          ) : (
            <div className="grid aspect-4/3 min-h-80 place-items-center rounded-4xl bg-linear-to-br from-primary/20 via-muted to-primary/5">
              <span className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                <ImageIcon aria-hidden="true" className="size-7" />
                {product.name} image
              </span>
            </div>
          )}
          <Card className="max-w-xl rounded-4xl shadow-none">
            <CardHeader>
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                Current product promo
              </p>
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-7">
                {product.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link
                to={`/products/${product.slug}`}
                className={buttonVariants()}
              >
                View product details <ArrowRight />
              </Link>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            No featured product is available right now.
          </p>
          <Link to="/products" className={buttonVariants()}>
            Browse products
          </Link>
        </div>
      )}
    </section>
  )
}
