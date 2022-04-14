import { createClient } from "@supabase/supabase-js";

const supabasUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SERVICE_ROLE;

if (supabasUrl === undefined || supabaseServiceKey === undefined) {
  throw Error(`Either SUPABASE_URL or SERVICE_ROLE is not available`);
}

export const supabaseClient = createClient(supabasUrl, supabaseServiceKey);
