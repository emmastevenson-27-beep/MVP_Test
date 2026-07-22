import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client authenticated with the service role key. Never import
// this from a Client Component — the service role key must stay off the
// browser bundle entirely, which is why it's not prefixed NEXT_PUBLIC_.
//
// Lazily constructed (rather than built at module load) so a missing env
// var only fails the specific request that needs it, not `next build`.
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
