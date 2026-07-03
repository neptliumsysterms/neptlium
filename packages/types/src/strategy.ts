import type { Metadata } from "./common";

/**
 * Strategy definition used by portfolio construction.
 */
export interface Strategy {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly objective: string;
  readonly horizon: "short" | "medium" | "long";
  readonly riskTarget?: string;
  readonly status: "active" | "inactive" | "deprecated";
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}
