import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import "./i18n"
import { GlobalRefreshingIndicator } from "@/components/global-refreshing-indicator"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { CartProvider } from "@/contexts/cart-context"
import { routeTree } from "@/route-tree"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()
const router = createBrowserRouter(routeTree)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
s
        </CartProvider>
                  <Toaster />
        <GlobalRefreshingIndicator />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
