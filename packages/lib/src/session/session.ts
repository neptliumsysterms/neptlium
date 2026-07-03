import { supabaseBrowser } from "../supabase/browser";
import type { User, Session as SupabaseSession } from "@supabase/supabase-js";

/**
 * Retrieve the current user session from the browser client.
 * Returns null if no active session exists.
 */
export async function getSession(): Promise<SupabaseSession | null> {
  const { data } = await supabaseBrowser.auth.getSession();
  return data.session;
}

/**
 * Retrieve the authenticated user from the browser client.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<User | null> {
  const { data } = await supabaseBrowser.auth.getUser();
  return data.user;
}

/**
 * Listen for authentication state changes.
 * Useful for updating UI when user logs in/out.
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  const { data } = supabaseBrowser.auth.onAuthStateChange(
    async (_event, session) => {
      callback(session?.user || null);
    }
  );
  return data.subscription;
}
