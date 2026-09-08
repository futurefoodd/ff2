import { Minus, Plus, ShoppingCart, ZoomIn } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

import { TopNavigation } from "@/components/top-navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useProduct } from "@/hooks/use-products"
import { ProductDetailSkeleton } from "@/components/product-skeletons"
import { useCart } from "@/contexts/cart-context"

function GalleryPlaceholder({ label }: { label: string }) {
  return (
    <div className="group relative overflow-hidden rounded-4xl bg-linear-to-br from-primary/25 via-muted to-primary/5">
      <div className="grid aspect-square place-items-center transition-transform duration-500 ease-out group-hover:scale-110">
        <div className="flex flex-col items-center gap-3 text-center text-sm font-medium text-muted-foreground">
          <ZoomIn className="size-8" />
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailPage() {
  const { productSlug } = useParams()
  return <ProductDetail key={productSlug} slug={productSlug} />
}

function ProductDetail({ slug }: { slug: string | undefined }) {
  const {
    data: product,
    isPending,
    error,
    refetch,
    isFetching,
  } = useProduct(slug)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  if (isPending || (error && product === undefined)) {
    return (
      <div className="min-h-svh bg-background">
        <TopNavigation />
        <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
          <Link to="/products" className="text-sm text-muted-foreground">
            ← Back to products
          </Link>
          {isPending ? (
            <ProductDetailSkeleton />
          ) : (
            <div className="mt-6 space-y-4">
              <p role="alert" className="text-destructive">
                Unable to load this product. Please try again.
              </p>
              <Button onClick={() => void refetch()} disabled={isFetching}>
                Try again
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-svh bg-background">
        <TopNavigation />
        <main className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <Card className="max-w-xl rounded-3xl">
            <CardHeader>
              <CardTitle>Product not found</CardTitle>
              <CardDescription>
                The product you requested is unavailable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/products" className={buttonVariants()}>
                Return to products
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <Link
          to="/products"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to products
        </Link>
        <section className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {product.images.length > 0 ? (
            <Carousel
              opts={{ loop: product.images.length > 1 }}
              className="mx-5"
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="group overflow-hidden rounded-4xl bg-muted">
                      <img
                        src={image.url}
                        alt={image.alt || product.name}
                        loading={index === 0 ? "eager" : "lazy"}
                        width={800}
                        height={800}
                        className="aspect-square w-full object-contain transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          ) : (
            <GalleryPlaceholder label={`${product.name} image unavailable`} />
          )}

          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {product.isFeatured ? "Featured product" : "Product"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {product.description}
              </p>
            )}
            {product.longDescription &&
              product.longDescription !== product.description && (
                <p className="mt-5 text-lg leading-8 whitespace-pre-line text-muted-foreground">
                  {product.longDescription}
                </p>
              )}
            <p className="mt-5 text-2xl font-semibold">
              RM {product.price.toFixed(2)}
            </p>
            <Card className="mt-8 rounded-3xl shadow-none">
              <CardContent className="flex flex-wrap items-center justify-between gap-5 pt-6">
                <div>
                  <p className="text-sm font-medium">Quantity</p>
                  <div className="mt-2 flex items-center rounded-full border">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Decrease quantity"
                      disabled={quantity === 1}
                      onClick={() => setQuantity((current) => current - 1)}
                    >
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((current) => current + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <Button
                  className="min-w-40"
                  onClick={() => {
                    addItem(product, quantity)
                    setIsAdded(true)
                  }}
                >
                  <ShoppingCart />
                  {isAdded ? `Added (${quantity})` : "Add to cart"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {(product.specs.length > 0 || product.nutrients.length > 0) && (
          <section className="mt-20 grid gap-8 lg:grid-cols-2">
            {product.specs.length > 0 && (
              <Card className="rounded-3xl shadow-none">
                <CardHeader>
                  <CardTitle>Product specifications</CardTitle>
                  <CardDescription>
                    Key information for this product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between gap-4 py-3 text-sm"
                      >
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="text-right font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}
            {product.nutrients.length > 0 && (
              <Card className="rounded-3xl shadow-none">
                <CardHeader>
                  <CardTitle>Nutrient content</CardTitle>
                  <CardDescription>Typical values per serving.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nutrient</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">
                          Daily value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.nutrients.map((nutrient) => (
                        <TableRow key={nutrient.nutrient}>
                          <TableCell className="font-medium">
                            {nutrient.nutrient}
                          </TableCell>
                          <TableCell>{nutrient.amount}</TableCell>
                          <TableCell className="text-right">
                            {nutrient.dailyValue}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {product.hasVideo && product.videoUrl && (
          <section className="mt-8">
            <Card className="overflow-hidden rounded-3xl py-0 shadow-none">
              <video
                controls
                preload="none"
                src={product.videoUrl}
                aria-label={`${product.name} video`}
                className="aspect-video w-full"
              />
              <CardHeader>
                <CardTitle>Learn more about {product.name}</CardTitle>
              </CardHeader>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}
