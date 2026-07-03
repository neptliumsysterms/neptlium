import type { Metadata } from "./common";

/**
 * Current and target allocation for a portfolio asset class.
 */
export interface AssetAllocation {
  readonly id: string;
  readonly portfolioId: string;
  readonly assetClass: string;
  readonly targetPercentage: number;
  readonly currentPercentage: number;
  readonly deviationPercentage: number;
  readonly rebalancingRequired: boolean;
  readonly lastReviewedAt: string;
  readonly metadata?: Metadata;
}
