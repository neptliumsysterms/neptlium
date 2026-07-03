import type { Metadata } from "./common";

/**
 * Authority status for a platform user.
 */
export type UserStatus = "active" | "pending" | "suspended" | "deactivated";

/**
 * Principal user identity in the authentication domain.
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly primaryRoleId: string;
  readonly roleIds: readonly string[];
  readonly status: UserStatus;
  readonly lastSignInAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}
