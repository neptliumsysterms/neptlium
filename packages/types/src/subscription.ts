import type { Metadata } from "./common";

/**
 * Subscription lifecycle status for platform entitlements.
 */
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired";

/**
 * Subscription contract used for service and support entitlements.
 */
export interface Subscription {
  readonly id: string;
  readonly ownerId: string;
  readonly plan: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly status: SubscriptionStatus;
  readonly renewalPeriod?: "monthly" | "quarterly" | "annual";
  readonly metadata?: Metadata;
}
