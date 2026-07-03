import type { Metadata } from "./common";
import type { AssetAllocation } from "./allocation";

/**
 * Status of a portfolio.
 */
export type PortfolioStatus = "active" | "paused" | "closed" | "pending";

/**
 * Performance summary for a portfolio over a defined period.
 */
export interface Performance {
  readonly period: "daily" | "monthly" | "quarterly" | "yearly" | "custom";
  readonly returnRate: number;
  readonly benchmarkReturn?: number;
  readonly alpha?: number;
  readonly volatility?: number;
  readonly maxDrawdown?: number;
  readonly asOf: string;
  readonly metadata?: Metadata;
}

/**
 * Portfolio holding detail for a single asset position.
 */
export interface Holding {
  readonly id: string;
  readonly portfolioId: string;
  readonly assetId: string;
  readonly assetName: string;
  readonly assetClass: string;
  readonly quantity: number;
  readonly costBasis: number;
  readonly marketValue: number;
  readonly currency: string;
  readonly weight: number;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}

/**
 * Primary portfolio entity used for investor allocations.
 */
export interface Portfolio {
  readonly id: string;
  readonly investorId: string;
  readonly name: string;
  readonly description?: string;
  readonly strategyId?: string;
  readonly currency: string;
  readonly status: PortfolioStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
  readonly holdings?: readonly Holding[];
  readonly performance?: Performance;
  readonly allocation?: readonly AssetAllocation[];
}
