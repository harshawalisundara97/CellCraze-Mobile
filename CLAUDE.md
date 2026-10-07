# CellCraze — Project Instructions

## Overview

E-commerce platform for a Sri Lankan mobile accessories shop. Two sides: customer storefront + admin back-office dashboard.

## UI: MUI (Material UI)

All UI components MUST use MUI. No custom UI primitives or shadcn/ui.

- `@mui/material` for all components (Button, TextField, Card, DataGrid, Dialog, Chip, etc.)
- `@mui/icons-material` for icons
- Custom MUI theme with CellCraze branding (accent #ec3013)
- Tailwind CSS only for layout (flex, grid, gap, padding) — never for component styling

## Key Conventions

- Currency: Sri Lankan Rupees as integers (389900 = Rs 3,899.00)
- Branch: `claude/pensive-planck-dg28et`
- Database: PostgreSQL + Prisma 5 (not Prisma 8)
- Auth: NextAuth.js with role-based access (CUSTOMER, MANAGER, ADMIN)
- Pages use `"use client"` with mock data until live API wiring

## Next.js 16 Gotchas

- No `export const dynamic` — use `NextRequest` param or `instant = false`
- Route params are `Promise<>` — must await
- `useSearchParams()` needs `<Suspense>` wrapper
- Middleware deprecated — use `proxy` convention
- Read `node_modules/next/dist/docs/` before writing new patterns

## Git

- Always commit and push to `claude/pensive-planck-dg28et`
- Never push to main without permission
- Descriptive commit messages with conventional commits style
