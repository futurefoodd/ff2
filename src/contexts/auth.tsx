import type { Provider, Session, User } from "@supabase/supabase-js"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { LoadingScreen } from "@/components/loading-screen"
import { supabase } from "@/lib/supabase"

type AuthContextValue = {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let initialized = false
    let receivedAuthEvent = false
    let isMounted = true
    let minimumLoadingTimer: number | undefined

    const minimumLoadingTime = new Promise<void>((resolve) => {
      minimumLoadingTimer = window.setTimeout(resolve, 2_000)
    })

    const {
      data: { subscription },
    } = supabase.client.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true
      setSession(nextSession)
      if (initialized) setLoading(false)
    })

    void Promise.all([
      supabase.client.auth.getSession(),
      minimumLoadingTime,
    ]).then(([{ data, error }]) => {
      if (!isMounted) return
      if (error) console.error("Could not load session", error)
      if (!receivedAuthEvent) setSession(data.session)
      initialized = true
      setLoading(false)
    })

    return () => {
      isMounted = false
      if (minimumLoadingTimer !== undefined) {
        window.clearTimeout(minimumLoadingTimer)
      }
      subscription.unsubscribe()
    }
  }, [])

  const signUpWithPassword: AuthContextValue["signUpWithPassword"] = (
    email,
    password
  ) =>
    supabase.client.auth.signUp({
      email,
      password,
    })

  const signInWithPassword: AuthContextValue["signInWithPassword"] = (
    email,
    password
  ) =>
    supabase.client.auth.signInWithPassword({
      email,
      password,
    })

  const requestPasswordReset: AuthContextValue["requestPasswordReset"] = (
    email
  ) =>
    supabase.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

  const updatePassword: AuthContextValue["updatePassword"] = (password) =>
    supabase.client.auth.updateUser({ password })

  const signInWithProvider: AuthContextValue["signInWithProvider"] = (
    provider
  ) =>
    supabase.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    })

  const signOut: AuthContextValue["signOut"] = () =>
    supabase.client.auth.signOut()

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signUpWithPassword,
        signInWithPassword,
        requestPasswordReset,
        updatePassword,
        signInWithProvider,
        signOut,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }
  return context
}
