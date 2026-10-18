import type { RouteObject } from "react-router-dom"

import { App, HomePage } from "@/App"
import { BioTherapeuticsNeurodivergencePage } from "@/pages/bio-therapeutics-neurodivergence-page"
import { CartPage } from "@/pages/cart-page"
import { CheckoutPage } from "@/pages/checkout-page"
import { PageNotFound } from "@/pages/page-not-found"
import { ConsultationsPage } from "@/pages/consultations-page"
import { DoctorsForumPage } from "@/pages/doctors-forum-page"
import { DualTherapyPage } from "@/pages/dual-therapy-page"
import { GutBrainAxisProbioticsPage } from "@/pages/gut-brain-axis-probiotics-page"
import { ProductDetailPage } from "@/pages/product-detail-page"
import { ProductsPage } from "@/pages/products-page"
import { SignInPage } from "@/pages/sign-in-page"
import { SignUpPage } from "@/pages/sign-up-page"
import { TourPage } from "@/pages/tour-page"
import { UpskillPage } from "@/pages/upskill-page"
import { SiteLayout } from "@/layout/site-layout"
import { CheckoutLayout } from "@/layout/checkout-layout"

export const routeTree = [
  {
    Component: App,
    children: [
      {
        Component: SiteLayout,
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
          { path: "sign-in", Component: SignInPage },
          { path: "sign-up", Component: SignUpPage },
          { path: "consultations", Component: ConsultationsPage },
          { path: "doctors-forum", Component: DoctorsForumPage },
          { path: "dual-therapy", Component: DualTherapyPage },
          { path: "tour", Component: TourPage },
          { path: "upskill", Component: UpskillPage },
          { path: "*", Component: PageNotFound },
        ]
      },
      {
        Component: CheckoutLayout,
        children: [
          { path: "cart", Component: CartPage },
          { path: "checkout", Component: CheckoutPage },

        ]
      }
    ],

  },
] satisfies RouteObject[]
