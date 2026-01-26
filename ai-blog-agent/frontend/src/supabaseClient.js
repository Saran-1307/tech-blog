import { createClient } from "@supabase/supabase-js";

// Pulls keys from the .env file
const supabaseUrl = os.getenv("SUPABASE_URL");
const supabaseAnonKey = os.getenv("SUPABASE_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
