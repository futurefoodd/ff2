import type { Session } from "@supabase/supabase-js"
import { useEffect, useState, type ReactNode } from "react"

import { LoadingScreen } from "@/components/loading-screen"
import { AuthContext } from "@/contexts/auth-context"
import type { AuthContextValue } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let initialized = false
    let receivedAuthEvent = false

    const {
      data: { subscription },
    } = supabase.client.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true
      setSession(nextSession)
      if (initialized) setLoading(false)
    })

    void Promise.resolve(
      supabase.client.auth.getSession()
    ).then(({ data, error }) => {
      if (error) console.error("Could not load session", error)
      if (!receivedAuthEvent) setSession(data.session)
      initialized = true
      setLoading(false)
    })

    return () => {
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
