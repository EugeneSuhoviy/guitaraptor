import { supabaseAnonkey, supabaseURL } from "@/app/config";

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from "../database.types";

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    supabaseURL,
    supabaseAnonkey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}