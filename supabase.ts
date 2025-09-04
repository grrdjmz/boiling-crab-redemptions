import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

/**
 * Returns a Supabase client. Pass `service` true to use the service role key.
 */
export function getSupabaseClient(service: boolean = false) {
  const key = service ? serviceRoleKey : anonKey;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false },
  });
}