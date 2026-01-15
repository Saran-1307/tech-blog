import { createClient } from "@supabase/supabase-js";

// USE THE ANON PUBLIC KEY HERE (Not the service key!)
const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_PUBLIC_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
