import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for public (unauthenticated) operations.
 * Uses the anonymous key and is safe to expose in client code.
 */
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
