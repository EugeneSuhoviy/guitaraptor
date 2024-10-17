import { supabaseAnonkey, supabaseURL } from "@/app/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(supabaseURL, supabaseAnonkey);