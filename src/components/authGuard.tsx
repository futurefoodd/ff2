import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/auth"

export function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export function GuestOnly() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : <Outlet />
}