import type { Provider, Session, User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { LoadingScreen } from "@/components/loading-screen"

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


 const signUpWithPassword = (email: string, password: string) => {
  return supabase.client.auth.signUp({
    email,
    password,
  })
}

 const signInWithPassword = (email: string, password: string) => {
  return supabase.client.auth.signInWithPassword({
    email,
    password,
  })
}

 const signInWithProvider = (provider: Provider) => {
  return supabase.client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
      queryParams: {
      prompt: "select_account",
    },
    },
  })
}

 const signOut = () => {
    return  supabase.client.auth.signOut()
  }

return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signUpWithPassword,
        signInWithPassword,
        signInWithProvider,
        signOut
      }}
      >
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  console.log(context)
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }
  return context
}
