import type { Metadata } from "./common";

/**
 * Outcome state for audit log entries.
 */
export type AuditOutcome = "success" | "failure" | "warning";

/**
 * Audit record for event tracking and compliance.
 */
export interface AuditLog {
  readonly id: string;
  readonly actorId: string;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly outcome: AuditOutcome;
  readonly timestamp: string;
  readonly source?: string;
  readonly detail?: string;
  readonly metadata?: Metadata;
}
