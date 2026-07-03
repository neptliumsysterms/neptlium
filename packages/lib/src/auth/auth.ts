import { supabaseBrowser } from "../supabase/browser";

/**
 * Sign in a user with email and password.
 * Returns user and session on success.
 */
export async function signIn(email: string, password: string) {
  return supabaseBrowser.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Sign out the current user.
 * Clears the session and auth token from the browser.
 */
export async function signOut() {
  return supabaseBrowser.auth.signOut();
}

/**
 * Sign up a new user with email and password.
 * User must confirm email before account is active.
 */
export async function signUp(email: string, password: string) {
  return supabaseBrowser.auth.signUp({
    email,
    password
  });
}

/**
 * Request a password reset email for a user.
 */
export async function resetPassword(email: string) {
  return supabaseBrowser.auth.resetPasswordForEmail(email);
}
