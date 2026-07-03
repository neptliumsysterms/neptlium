# @netlium/web

Institutional marketing and governance platform for Netlium Systems.

## Purpose

- Public-facing marketing and documentation
- Institutional governance information
- Access request management
- System status and announcements

## Folder Structure

```
app/              → Next.js App Router pages
components/       → React components
lib/              → Shared utilities and helpers
public/           → Static assets
```

## Quick Start

```bash
# Development
pnpm --filter @netlium/web dev

# Build
pnpm --filter @netlium/web build

# Type check
pnpm --filter @netlium/web typecheck
```

## Environment Variables

```env
# Inherited from root
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

- Uses `@netlium/types` for shared domain models
- Uses `@netlium/lib` for platform infrastructure
- Uses `@netlium/ui` for component library
- Supabase-powered data layer via @netlium/lib
