import type { Provider, Session, User } from "@supabase/supabase-js"
import { createContext, useContext } from "react"

import { supabase } from "@/lib/supabase"

export type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signUpWithPassword: (
    email: string,
    password: string
  ) => ReturnType<typeof supabase.client.auth.signUp>
  signInWithPassword: (
    email: string,
    password: string
  ) => ReturnType<typeof supabase.client.auth.signInWithPassword>
  requestPasswordReset: (
    email: string
  ) => ReturnType<typeof supabase.client.auth.resetPasswordForEmail>
  updatePassword: (
    password: string
  ) => ReturnType<typeof supabase.client.auth.updateUser>
  signInWithProvider: (
    provider: Provider
  ) => ReturnType<typeof supabase.client.auth.signInWithOAuth>
  signOut: () => ReturnType<typeof supabase.client.auth.signOut>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }
  return context
}
