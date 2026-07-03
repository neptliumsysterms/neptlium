import type { Metadata } from "./common";

/**
 * Permission subject used by role-based access control models.
 */
export interface Permission {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly category?: string;
  readonly metadata?: Metadata;
}

/**
 * Role metadata for authorization boundaries.
 */
export interface Role {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description?: string;
  readonly permissions: readonly string[];
  readonly metadata?: Metadata;
}

/**
 * Authentication session state for user tokens and lifecycle.
 */
export type SessionStatus = "active" | "expired" | "revoked" | "suspended";

export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly roleIds: readonly string[];
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly status: SessionStatus;
  readonly revokedAt?: string;
  readonly metadata?: Metadata;
}
