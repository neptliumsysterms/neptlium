import type { Metadata } from "./common";

/**
 * Transaction classification used by treasury workflows.
 */
export type TransactionType =
  | "transfer"
  | "settlement"
  | "fee"
  | "reconciliation"
  | "withdrawal"
  | "deposit";

/**
 * Transaction status lifecycle used inside the treasury domain.
 */
export type TransactionStatus = "pending" | "processing" | "settled" | "failed" | "cancelled";

/**
 * Transaction record representing movement between treasury accounts.
 */
export interface Transaction {
  readonly id: string;
  readonly sourceAccountId: string;
  readonly destinationAccountId: string;
  readonly amount: number;
  readonly currency: string;
  readonly transactionType: TransactionType;
  readonly status: TransactionStatus;
  readonly initiatedAt: string;
  readonly settledAt?: string;
  readonly reference?: string;
  readonly ledgerEntryIds?: readonly string[];
  readonly metadata?: Metadata;
}
