import { supabaseAnonkey, supabaseURL } from "@/app/config";
import { createBrowserClient } from '@supabase/ssr'
import { Database } from "../database.types";

export function createClient() {
    return createBrowserClient<Database>(supabaseURL, supabaseAnonkey)
}