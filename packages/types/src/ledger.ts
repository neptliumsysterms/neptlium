import type { Metadata } from "./common";

/**
 * Ledger entry type for financial bookkeeping.
 */
export type LedgerEntryType = "debit" | "credit" | "adjustment" | "fee" | "settlement";

/**
 * Ledger entry record used for reconciliation and audit.
 */
export interface LedgerEntry {
  readonly id: string;
  readonly accountId: string;
  readonly transactionId: string;
  readonly entryType: LedgerEntryType;
  readonly amount: number;
  readonly currency: string;
  readonly postedAt: string;
  readonly description?: string;
  readonly metadata?: Metadata;
}
