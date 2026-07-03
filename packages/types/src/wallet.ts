import type { Metadata } from "./common";

/**
 * Wallet lifecycle status.
 */
export type WalletStatus = "active" | "inactive" | "locked" | "closed";

/**
 * Tokenized or custodial wallet used for treasury settlement.
 */
export interface Wallet {
  readonly id: string;
  readonly ownerId: string;
  readonly currency: string;
  readonly totalBalance: number;
  readonly availableBalance: number;
  readonly reservedBalance: number;
  readonly status: WalletStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: Metadata;
}
