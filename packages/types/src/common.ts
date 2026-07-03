import type { JsonValue } from "./database";

/**
 * Shared metadata fields for tracking entities and payload context.
 */
export interface Metadata {
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly createdBy?: string;
  readonly updatedBy?: string;
  readonly sourceSystem?: string;
  readonly tags?: readonly string[];
  readonly custom?: Readonly<Record<string, JsonValue>>;
}

/**
 * Standard pagination contract for list responses.
 */
export interface Pagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalRecords: number;
  readonly totalPages: number;
  readonly cursor?: string;
}

/**
 * Structured error details for API responses.
 */
export interface ErrorResponse {
  readonly code: string;
  readonly message: string;
  readonly details?: string;
  readonly target?: string;
  readonly correlationId?: string;
  readonly status?: number;
}

/**
 * Generic API response envelope used throughout the platform.
 */
export interface ApiResponse<T> {
  readonly status: "success" | "error";
  readonly data?: T;
  readonly errors?: readonly ErrorResponse[];
  readonly meta?: Metadata;
  readonly pagination?: Pagination;
  readonly correlationId?: string;
}
