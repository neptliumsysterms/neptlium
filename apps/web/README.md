# @neptlium/web

Neptlium marketing website — public-facing, no authentication.

## Purpose

Static marketing site at neptlium.com. No Supabase, no auth, no user state. All CTAs for institutional access redirect to app.neptlium.com.

## Folder Structure

```
app/
  layout.tsx          → Root layout: metadata, Header, Footer
  page.tsx            → Home (/)
  about/page.tsx      → About (/about)
  platform/page.tsx   → Platform (/platform)
  security/page.tsx   → Security (/security)
  contact/page.tsx    → Contact form (/contact)
  legal/
    privacy/page.tsx  → Privacy policy (/legal/privacy)
    terms/page.tsx    → Terms of service (/legal/terms)
  not-found.tsx       → 404 handler
src/
  components/
    layout/           → Header, Footer
    nav/              → MegaMenu, MobileAccordionNav
    ui/               → UI primitives + custom animations
  lib/                → constants, utils, branding
  hooks/              → use-mobile, use-toast
public/               → favicon.png, robots.txt, og-marketing.png
```

## Quick Start

```bash
# From monorepo root — development (port 8080)
pnpm --filter @neptlium/web dev

# Build
pnpm --filter @neptlium/web build

# Typecheck
pnpm --filter @neptlium/web typecheck
```

## Key pages

| Route | Description |
|---|---|
| `/` | Hero and marketing overview |
| `/platform` | Platform infrastructure details |
| `/security` | Security posture |
| `/about` | Company and team |
| `/contact` | Contact form |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |

## Architecture

- **Next.js 16 App Router** — server components by default
- **`@neptlium/design-system`** — shared Tailwind tokens and utilities
- Components that use browser APIs or React hooks have `"use client"` directives
- No Supabase, no server actions — purely static/edge-rendered marketing pages
