import { supabaseAnonkey, supabaseURL } from "@/app/config";
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(supabaseURL, supabaseAnonkey)
}