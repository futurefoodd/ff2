import { Outlet } from "react-router-dom"

import { TopNavigation } from "@/components/top-navigation"

export function SiteLayout() {
  return (
    <>
      <TopNavigation />
      <Outlet />
    </>
  )
}