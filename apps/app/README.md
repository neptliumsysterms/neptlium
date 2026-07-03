# @netlium/app

Institutional capital operations dashboard for Netlium Systems.

## Purpose

Primary dashboard for institutional investors and operators:
- Authentication and authorization
- Portfolio management and monitoring
- Treasury operations and settlements
- Real-time data visualization
- Institutional governance interface

## Folder Structure

```
app/              → Next.js App Router (layout, pages)
  ├── login/      → Authentication page
  ├── dashboard/  → Main dashboard shell
  │   ├── treasury/    → Treasury operations module
  │   └── portfolio/   → Portfolio management module
components/       → React components
modules/          → Feature modules (treasury, portfolio, etc.)
  ├── treasury/   → Treasury business logic
  └── portfolio/  → Portfolio business logic
lib/              → Shared utilities
```

## Quick Start

```bash
# Development (runs on port 3001)
pnpm --filter @netlium/app dev

# Build
pnpm --filter @netlium/app build

# Type check
pnpm --filter @netlium/app typecheck
```

## Environment Variables

```env
# Inherited from root
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Architecture

- Uses `@netlium/types` for shared domain models
- Uses `@netlium/lib` for authentication and Supabase clients
- Uses `@netlium/ui` for institutional UI components
- Module-based organization (treasury, portfolio, etc.)
- Server components with client interactivity where needed

## Key Pages

- `/login` — Authentication entry point
- `/dashboard` — Overview and system status
- `/dashboard/treasury` — Treasury account management
- `/dashboard/portfolio` — Portfolio and holdings tracking
