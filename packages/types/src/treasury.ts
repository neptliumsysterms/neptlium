import type { Metadata } from "./common";

/**
 * Treasury account type used for liquidity and settlement.
 */
export type TreasuryAccountType = "operational" | "custodial" | "settlement" | "reserve" | "liquidity";

/**
 * Treasury account lifecycle state.
 */
export type TreasuryAccountStatus = "active" | "inactive" | "frozen" | "closed";

/**
 * Bank or custodial account used by the treasury domain.
 */
export interface TreasuryAccount {
  readonly id: string;
  readonly name: string;
  readonly accountType: TreasuryAccountType;
  readonly institutionName: string;
  readonly currency: string;
  readonly status: TreasuryAccountStatus;
  readonly routingReference?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}

/**
 * Balance snapshot for treasury and wallet ledgers.
 */
export interface Balance {
  readonly currency: string;
  readonly total: number;
  readonly available: number;
  readonly reserved: number;
  readonly asOf: string;
  readonly metadata?: Metadata;
}
