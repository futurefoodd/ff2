import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { ReactNode } from "react"

import { FeaturedProduct } from "@/components/featured-product"
import { CartProvider } from "@/contexts/cart-context"
import { ProductDetailPage } from "@/pages/product-detail-page"
import { ProductsPage } from "@/pages/products-page"
import {
  fetchFeaturedProduct,
  fetchProductBySlug,
  fetchProducts,
} from "@/services/products"
import type {
  ProductDetailResponse,
  ProductSummaryResponse,
} from "@/types/product-responses"

vi.mock("@/services/products", () => ({
  fetchFeaturedProduct: vi.fn(),
  fetchProductBySlug: vi.fn(),
  fetchProducts: vi.fn(),
}))
vi.mock("@/components/top-navigation", () => ({ TopNavigation: () => null }))

const product: ProductSummaryResponse = {
  id: "product-1",
  slug: "pro-collagen",
  name: "Pro Collagen",
  description: "Product description from the catalog.",
  price: 49,
  isFeatured: true,
  image: {
    id: "image-1",
    type: "image",
    storagePath: "product-1/primary.webp",
    url: "https://example.com/primary.webp",
    alt: "Pro Collagen packaging",
  },
}

const productDetail: ProductDetailResponse = {
  ...product,
  longDescription: "Full product description from Supabase.",
  hasVideo: false,
  videoUrl: null,
  images: [product.image!],
  specs: [],
  nutrients: [],
}

function renderQuery(children: ReactNode, initialEntries = ["/"]) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
  return client
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

describe("API product loading", () => {
  it("replaces the featured skeleton with the fetched image, copy and product link", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    let resolve!: (value: ProductSummaryResponse) => void
    vi.mocked(fetchFeaturedProduct).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    renderQuery(<FeaturedProduct />)
    expect(
      screen.getByRole("status", { name: "Loading featured product" })
    ).toHaveAttribute("aria-busy", "true")
    resolve(product)
    expect(await screen.findByText(product.name)).toBeVisible()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.getByText(product.description)).toBeVisible()
    expect(screen.getByRole("img")).toHaveAttribute("src", product.image!.url)
    expect(
      screen.getByRole("link", { name: /View product details/ })
    ).toHaveAttribute("href", "/products/pro-collagen")
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining("expected a native <button>")
    )
  })

  it("shows the listing skeleton until products arrive", async () => {
    let resolve!: (value: ProductSummaryResponse[]) => void
    vi.mocked(fetchProducts).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    renderQuery(<ProductsPage />)
    expect(
      screen.getByRole("status", { name: "Loading products" })
    ).toBeVisible()
    resolve([product])
    expect(await screen.findByText(product.name)).toBeVisible()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("loads a product detail by slug with its image and description", async () => {
    let resolve!: (value: ProductDetailResponse) => void
    vi.mocked(fetchProductBySlug).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )

    renderQuery(
      <Routes>
        <Route
          path="/products/:productSlug"
          element={
            <CartProvider>
              <ProductDetailPage />
            </CartProvider>
          }
        />
      </Routes>,
      ["/products/pro-collagen"]
    )

    expect(
      screen.getByRole("status", { name: "Loading product details" })
    ).toBeVisible()
    resolve(productDetail)

    expect(
      await screen.findByRole("heading", { name: productDetail.name })
    ).toBeVisible()
    expect(fetchProductBySlug).toHaveBeenCalledWith("pro-collagen")
    expect(screen.getByText(productDetail.longDescription)).toBeVisible()
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      productDetail.image!.url
    )
  })

  it("offers a retry when the featured request fails", async () => {
    vi.mocked(fetchFeaturedProduct)
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce(product)
    renderQuery(<FeaturedProduct />)
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load")
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(await screen.findByText(product.name)).toBeVisible()
  })

  it("handles an empty featured result", async () => {
    vi.mocked(fetchFeaturedProduct).mockResolvedValue(null)
    renderQuery(<FeaturedProduct />)
    expect(
      await screen.findByText("No featured product is available right now.")
    ).toBeVisible()
    expect(
      screen.getByRole("link", { name: "Browse products" })
    ).toHaveAttribute("href", "/products")
  })

  it("handles an empty listing", async () => {
    vi.mocked(fetchProducts).mockResolvedValue([])
    renderQuery(<ProductsPage />)
    expect(
      await screen.findByText("No products are available right now.")
    ).toBeVisible()
  })

  it("keeps cached products visible when a background refresh fails", async () => {
    vi.mocked(fetchProducts)
      .mockResolvedValueOnce([product])
      .mockRejectedValueOnce(new Error("Offline"))
    const client = renderQuery(<ProductsPage />)
    await screen.findByText(product.name)
    await client.invalidateQueries({ queryKey: ["products"] })
    await waitFor(() =>
      expect(client.getQueryState(["products"])?.status).toBe("error")
    )
    expect(screen.getByText(product.name)).toBeVisible()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
