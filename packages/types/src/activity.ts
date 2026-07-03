import type { Metadata } from "./common";

/**
 * Activity record for user and system workflows.
 */
export interface Activity {
  readonly id: string;
  readonly ownerId: string;
  readonly type: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly relatedEntityType?: string;
  readonly relatedEntityId?: string;
  readonly metadata?: Metadata;
}
