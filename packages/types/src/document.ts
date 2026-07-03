import type { Metadata } from "./common";

/**
 * Attachment metadata for document assets.
 */
export interface Attachment {
  readonly id: string;
  readonly documentId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly fileSizeBytes: number;
  readonly url: string;
  readonly uploadedAt: string;
  readonly uploadedBy: string;
  readonly metadata?: Metadata;
}

/**
 * Document entity used for institutional records and filings.
 */
export type DocumentStatus = "draft" | "active" | "archived" | "expired";

export interface Document {
  readonly id: string;
  readonly title: string;
  readonly type: string;
  readonly ownerId: string;
  readonly status: DocumentStatus;
  readonly uploadedAt: string;
  readonly updatedAt: string;
  readonly tags?: readonly string[];
  readonly attachments?: readonly Attachment[];
  readonly metadata?: Metadata;
}
