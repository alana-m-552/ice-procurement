import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)

let client: SupabaseClient | null = null

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl as string, supabasePublishableKey as string, {
    auth: { persistSession: false },
  })
} else {
  console.log(
    "[v0] Supabase is not configured. Missing env vars:",
    [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !supabasePublishableKey && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ]
      .filter(Boolean)
      .join(", "),
  )
}

/**
 * Returns a configured Supabase client, or throws a descriptive error if the
 * required environment variables are not present. Call this inside request
 * handlers so a missing configuration produces a clean JSON error response
 * instead of crashing the module at import time.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your project environment variables.",
    )
  }
  return client
}

// Backwards-compatible export. Prefer getSupabase() in new code.
export const supabase = client as SupabaseClient
