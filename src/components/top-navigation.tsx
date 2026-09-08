import {
  Menu,
  // ShoppingCart
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { LanguageSelect } from "@/components/language-select"
import {
  Button,
  // buttonVariants
} from "@/components/ui/button"
// import { useCart } from "@/contexts/cart-context"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigationItems = [
  "home",
  "products",
  "doctorsForum",
  "upskill",
  "tour",
] as const

function navigationTo(item: (typeof navigationItems)[number]) {
  if (item === "doctorsForum") return "/doctors-forum"

  return `/${item}`
}

export function TopNavigation() {
  const { t } = useTranslation()
  // const { itemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const dieteticsItems = [
    {
      label: "Dual Therapy & Nutrient Synergy",
      to: "/dual-therapy",
    },
    {
      label: "Gut-Brain Axis & Probiotics",
      to: "/gut-brain-axis-probiotics",
    },
    {
      label: "Bio-Therapeutics in Neurodivergence",
      to: "/bio-therapeutics-neurodivergence",
    },
    {
      label: "Request for Nutrition Consult",
      to: "/consultations",
    },
  ]

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-x-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          aria-label={t("navigation.company")}
          className="flex items-center gap-2.5"
        >
          <img
            src="/ff_icon.png"
            alt="Future Foods logo"
            className="size-9 rounded-md object-cover"
          />
        </Link>

        <NavigationMenu
          aria-label={t("navigation.primary")}
          className="hidden flex-1 overflow-visible md:flex"
        >
          <NavigationMenuList className="min-w-max justify-start gap-1 text-muted-foreground md:justify-center">
            {navigationItems.slice(0, 3).map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink
                  className="px-3.5 py-2 hover:text-foreground"
                  render={<Link to={navigationTo(item)} />}
                >
                  {t(`navigation.${item}`)}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3.5 text-muted-foreground hover:text-foreground">
                {t("navigation.dietetics")}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-80 p-1.5">
                <ul>
                  {dieteticsItems.map((item) => (
                    <li key={item.to}>
                      <NavigationMenuLink render={<Link to={item.to} />}>
                        {item.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {navigationItems.slice(3).map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink
                  className="px-3.5 py-2 hover:text-foreground"
                  render={<Link to={navigationTo(item)} />}
                >
                  {t(`navigation.${item}`)}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t("navigation.openMenu")}
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(22rem,85vw)] p-0">
              <SheetHeader className="border-b pr-14">
                <SheetTitle>{t("navigation.menu")}</SheetTitle>
              </SheetHeader>
              <nav aria-label={t("navigation.primary")} className="p-3">
                <ul className="space-y-1">
                  {navigationItems.slice(0, 3).map((item) => (
                    <li key={item}>
                      <Link
                        className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-accent"
                        to={navigationTo(item)}
                        onClick={closeMobileMenu}
                      >
                        {t(`navigation.${item}`)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <details className="group">
                      <summary className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium hover:bg-accent">
                        {t("navigation.dietetics")}
                      </summary>
                      <ul className="mt-1 border-l border-border pl-3">
                        {dieteticsItems.map((item) => (
                          <li key={item.to}>
                            <Link
                              className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                              to={item.to}
                              onClick={closeMobileMenu}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  {navigationItems.slice(3).map((item) => (
                    <li key={item}>
                      <Link
                        className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-accent"
                        to={navigationTo(item)}
                        onClick={closeMobileMenu}
                      >
                        {t(`navigation.${item}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* <div className="grid gap-2 border-t p-3">
                <Link
                  to="/cart"
                  className={buttonVariants({ variant: "ghost" })}
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart /> Cart{itemCount > 0 && ` (${itemCount})`}
                </Link>
                <Link
                  to="/sign-in"
                  className={buttonVariants({ variant: "outline" })}
                  onClick={closeMobileMenu}
                >
                  {t("navigation.signIn")}
                </Link>
                <Link
                  to="/sign-up"
                  className={buttonVariants()}
                  onClick={closeMobileMenu}
                >
                  {t("navigation.signUp")}
                </Link>
              </div> */}
            </SheetContent>
          </Sheet>
          {/* <div className="hidden items-center gap-1 md:flex">
            <Link
              to="/cart"
              aria-label="Cart"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <ShoppingCart />
              {itemCount > 0 && (
                <span className="sr-only">{itemCount} items in cart</span>
              )}
            </Link>
            <Link
              to="/sign-in"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t("navigation.signIn")}
            </Link>
            <Link to="/sign-up" className={buttonVariants({ size: "sm" })}>
              {t("navigation.signUp")}
            </Link>
          </div> */}
          <LanguageSelect />
        </div>
      </div>
    </header>
  )
}
