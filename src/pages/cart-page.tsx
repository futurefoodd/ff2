import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { TopNavigation } from "@/components/top-navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

const formatPrice = (price: number) => `RM ${price.toFixed(2)}`

export function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart()

  return (
    <div className="min-h-svh bg-background">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <h1 className="text-4xl font-semibold tracking-tight">Your cart</h1>
        {items.length === 0 ? (
          <Card className="mt-10 max-w-xl rounded-3xl">
            <CardHeader>
              <ShoppingBag className="size-8 text-primary" />
              <CardTitle className="mt-3">Your cart is empty</CardTitle>
              <CardDescription>Add a product to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/products" className={buttonVariants()}>
                Browse products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.slug} className="rounded-3xl">
                  <CardContent className="flex flex-wrap items-center gap-5 pt-6">
                    <div className="grid size-20 place-items-center rounded-2xl bg-muted text-xs text-muted-foreground">
                      Image
                    </div>
                    <div className="min-w-40 flex-1">
                      <h2 className="font-semibold">{item.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center rounded-full border">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.slug)}
                    >
                      <Trash2 />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="h-fit rounded-3xl">
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Link
                  to="/checkout"
                  className={buttonVariants({ className: "mt-6 w-full" })}
                >
                  Proceed to checkout
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
