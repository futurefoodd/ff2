import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/cart-context"

const formatPrice = (price: number) => `RM ${price.toFixed(2)}`

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [isComplete, setIsComplete] = useState(false)

  if (items.length === 0 && !isComplete)
    return (
      <div className="min-h-svh bg-background">
        <TopNavigation />
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          <Card className="max-w-xl rounded-3xl">
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>
                Add products before checking out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/products" className={buttonVariants()}>
                Browse products
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )

  if (isComplete)
    return (
      <div className="min-h-svh bg-background">
        <TopNavigation />
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          <Card className="max-w-xl rounded-3xl">
            <CardHeader>
              <CardTitle>Order received</CardTitle>
              <CardDescription>
                Thank you. This demo checkout does not process payment; connect
                your payment provider before going live.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/products" className={buttonVariants()}>
                Continue shopping
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )

  return (
    <div className="min-h-svh bg-background">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Contact and delivery</CardTitle>
              <CardDescription>
                Enter your details to place the order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  clearCart()
                  setIsComplete(true)
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" required />
                </div>
                <Button className="sm:col-span-2" type="submit">
                  Place order · {formatPrice(total)}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="h-fit rounded-3xl">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
