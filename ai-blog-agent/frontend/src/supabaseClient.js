import { createClient } from "@supabase/supabase-js";

// USE THE ANON PUBLIC KEY HERE (Not the service key!)
const supabaseUrl = "https://rmidgficnfbtrlzanfyd.supabase.co";
const supabaseKey = "sb_publishable_iiwQ-ixEeVgHYS4OMDERPA_v_DcWDZp";

export const supabase = createClient(supabaseUrl, supabaseKey);
