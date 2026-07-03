/**
 * JSON primitives used in database records and metadata.
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON object shape used for unstructured fields.
 */
export interface JsonObject {
  readonly [key: string]: JsonValue;
}

/**
 * JSON array shape used for unstructured fields.
 */
export interface JsonArray extends ReadonlyArray<JsonValue> {}

/**
 * Union of supported JSON values for database metadata and polymorphic payloads.
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Generic record type for database rows.
 */
export type DatabaseRecord<T extends Record<string, unknown> = Record<string, unknown>> = {
  readonly [K in keyof T]: T[K];
};

/**
 * Utility type for Supabase schema definitions.
 */
export interface SupabaseSchema<
  Tables extends Record<string, Record<string, unknown>> = Record<string, Record<string, unknown>>
> {
  readonly tables: Tables;
  readonly views?: Record<string, unknown>;
  readonly functions?: Record<string, unknown>;
  readonly enums?: Record<string, readonly string[]>;
}

/**
 * Placeholder for the generated Supabase database schema.
 */
export type SupabaseDatabase = SupabaseSchema;

/**
 * Extract row type for a table from a Supabase schema.
 */
export type DatabaseTableRow<
  Schema extends SupabaseSchema,
  Table extends keyof Schema["tables"]
> = Schema["tables"][Table];
