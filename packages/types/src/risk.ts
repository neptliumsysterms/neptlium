import type { Metadata } from "./common";

/**
 * Risk categories used across scoring workflows.
 */
export type RiskCategory = "market" | "credit" | "liquidity" | "operational" | "compliance" | "strategic";

/**
 * Severity categories for risk alerts.
 */
export type AlertSeverity = "info" | "minor" | "major" | "critical";

/**
 * Lifecycle state for risk alerts.
 */
export type AlertStatus = "open" | "acknowledged" | "resolved" | "suppressed";

/**
 * Risk scoring record for portfolio exposures.
 */
export interface RiskScore {
  readonly portfolioId: string;
  readonly score: number;
  readonly category: RiskCategory;
  readonly probability: number;
  readonly effectiveDate: string;
  readonly source?: string;
  readonly rationale?: string;
  readonly metadata?: Metadata;
}

/**
 * Exposure metric describing asset concentration and risk.
 */
export interface Exposure {
  readonly portfolioId: string;
  readonly assetClass: string;
  readonly amount: number;
  readonly exposurePercentage: number;
  readonly concentrationRisk: boolean;
  readonly asOf: string;
  readonly metadata?: Metadata;
}

/**
 * Risk alert triggered by a threshold or event.
 */
export interface Alert {
  readonly id: string;
  readonly type: string;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly triggeredAt: string;
  readonly resolvedAt?: string;
  readonly status: AlertStatus;
  readonly relatedEntityType?: string;
  readonly relatedEntityId?: string;
  readonly metadata?: Metadata;
}
