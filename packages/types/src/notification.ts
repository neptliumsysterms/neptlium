import type { Metadata } from "./common";

/**
 * Notification delivery channel.
 */
export type NotificationChannel = "email" | "sms" | "push" | "webhook" | "system";

/**
 * Notification priority classification.
 */
export type NotificationPriority = "low" | "medium" | "high" | "critical";

/**
 * Notification status for operational workflows.
 */
export type NotificationStatus = "pending" | "sent" | "delivered" | "failed" | "read";

/**
 * Notification payload used for user and system messaging.
 */
export interface Notification {
  readonly id: string;
  readonly recipientId: string;
  readonly subject: string;
  readonly message: string;
  readonly channel: NotificationChannel;
  readonly priority: NotificationPriority;
  readonly status: NotificationStatus;
  readonly sentAt?: string;
  readonly readAt?: string;
  readonly metadata?: Metadata;
}
