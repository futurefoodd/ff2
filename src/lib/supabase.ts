import { createClient } from "@supabase/supabase-js"

import { env } from "@/config/env"
import type { Database } from "@/types/supabase.generated"

let client: ReturnType<typeof createClient<Database>> | undefined

export function getSupabaseClient() {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    )
  }

  client ??= createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )

  return client
}

export const supabase = {
  get client() {
    return getSupabaseClient()
  },
}
