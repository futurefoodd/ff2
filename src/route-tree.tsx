import type { RouteObject } from "react-router-dom"

import { App, HomePage } from "@/App"
import { BioTherapeuticsNeurodivergencePage } from "@/pages/bio-therapeutics-neurodivergence-page"
// import { CartPage } from "@/pages/cart-page"
// import { CheckoutPage } from "@/pages/checkout-page"
import { PageNotFound } from "@/pages/page-not-found"
import { ConsultationsPage } from "@/pages/consultations-page"
import { DoctorsForumPage } from "@/pages/doctors-forum-page"
import { DualTherapyPage } from "@/pages/dual-therapy-page"
import { GutBrainAxisProbioticsPage } from "@/pages/gut-brain-axis-probiotics-page"
import { ProductDetailPage } from "@/pages/product-detail-page"
import { ProductsPage } from "@/pages/products-page"
import { TourPage } from "@/pages/tour-page"
import { UpskillPage } from "@/pages/upskill-page"

export const routeTree = [
  {
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "home", Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "products/:productSlug", Component: ProductDetailPage },
      {
        path: "bio-therapeutics-neurodivergence",
        Component: BioTherapeuticsNeurodivergencePage,
      },
      {
        path: "gut-brain-axis-probiotics",
        Component: GutBrainAxisProbioticsPage,
      },
      // { path: "cart", Component: CartPage },
      // { path: "checkout", Component: CheckoutPage },
      { path: "consultations", Component: ConsultationsPage },
      { path: "doctors-forum", Component: DoctorsForumPage },
      { path: "dual-therapy", Component: DualTherapyPage },
      { path: "tour", Component: TourPage },
      { path: "upskill", Component: UpskillPage },
      { path: "*", Component: PageNotFound },
    ],
  },
] satisfies RouteObject[]
