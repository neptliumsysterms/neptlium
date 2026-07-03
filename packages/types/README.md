# @netlium/types

`@netlium/types` is the shared domain model package for Netlium Systems. It centralizes typed interfaces and reusable domain contracts across the monorepo to support institutional capital operating software.

## Purpose

- Provide a single source of truth for shared domain models.
- Prevent duplicate interface definitions across applications and packages.
- Enforce explicit, immutable, production-ready types for core business domains.

## Domain organization

The package is organized by bounded contexts:

- `Authentication` — user identity, session state, roles, permissions.
- `Common` — API payloads, pagination, metadata, error shaping.
- `Investor` — investor profile, organization, and entity details.
- `Portfolio` — portfolio composition, holdings, performance, allocation.
- `Treasury` — accounts, wallets, ledger entries, transactions, balances.
- `Operations` — notifications, audit logs, workflow activity.
- `Risk` — scores, exposures, alerts.
- `Documents` — document metadata and attachments.
- `Database` — shared database utility types and Supabase schema placeholder.

## Export strategy

This package exposes a flat public API from the package root. Consumers can import any shared model directly:

```ts
import { Portfolio, User, Notification, ApiResponse } from "@netlium/types";
```

The package also supports subpath exports for module-level imports:

```ts
import { Session } from "@netlium/types/auth";
import { RiskScore } from "@netlium/types/risk";
```

## Dependency rules

- `@netlium/types` is a pure type package and does not implement application logic.
- No Supabase client behavior is defined here; only shared database types and schema utilities.
- This package is intended to be consumed by `@netlium/lib`, `@netlium/ui`, and application layers.

## Usage examples

```ts
import { Investor, Portfolio, Transaction, ApiResponse } from "@netlium/types";

const response: ApiResponse<Portfolio> = {
  status: "success",
  data: {
    id: "portfolio-123",
    investorId: "investor-456",
    name: "Global Growth",
    currency: "USD",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
```

```ts
import { Notification } from "@netlium/types/notification";

const alert: Notification = {
  id: "notif-001",
  recipientId: "user-789",
  subject: "Portfolio Review Required",
  message: "Your allocation drift exceeds threshold.",
  channel: "email",
  priority: "high",
  status: "pending",
  sentAt: new Date().toISOString(),
};
```

## Build

Use the package scripts from the package root:

```bash
pnpm --filter @netlium/types build
pnpm --filter @netlium/types check-types
pnpm --filter @netlium/types lint
```
