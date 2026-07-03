/**
 * @netlium/lib — Core Platform Engine
 *
 * Centralizes all shared platform infrastructure:
 * - Supabase clients (browser + server)
 * - Authentication system
 * - Role-based access control (RBAC)
 * - Session management
 */

export * from "./supabase/browser";
export * from "./supabase/server";
export * from "./auth/auth";
export * from "./rbac/roles";
export * from "./session/session";
