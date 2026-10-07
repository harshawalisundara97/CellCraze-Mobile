<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# CellCraze — Agent Instructions

## Project Vision

CellCraze is a full-stack e-commerce platform for a mobile accessories shop in Sri Lanka. It serves two purposes:

1. **Online Storefront** — Customers browse phones, headphones, earphones, chargers, smartwatches, and accessories, add to cart, and purchase with real payment processing (Stripe, COD, bank transfer).
2. **Admin Back-Office** — The shop owner manages inventory, suppliers, purchase orders (PO), goods received notes (GRN), invoices, stock levels, and views profit/sales reports.

## UI Framework

**Use MUI (Material UI) for ALL UI components across the entire website.**

- Install `@mui/material`, `@mui/icons-material`, and `@emotion/react` + `@emotion/styled`
- Replace all existing custom UI primitives and shadcn/ui components with MUI equivalents
- Use MUI's `ThemeProvider` with a custom CellCraze theme (accent: #ec3013, dark neutrals)
- Use MUI `DataGrid` for all admin tables
- Use MUI `Card`, `Button`, `TextField`, `Dialog`, `Chip`, `Badge`, etc. throughout
- Keep Tailwind CSS only for layout utilities (flex, grid, spacing) — all component styling goes through MUI

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, cacheComponents enabled) |
| Language | TypeScript (strict) |
| Database | PostgreSQL + Prisma 5 |
| Auth | NextAuth.js v5 (Credentials + Google OAuth) |
| UI Components | **MUI (Material UI)** |
| Layout Utilities | Tailwind CSS v4 |
| Client State | Zustand |
| Validation | Zod + React Hook Form |
| Payments | Stripe (Checkout Sessions + Webhooks) |
| Images | Cloudinary |
| Email | Resend + React Email |
| Charts | Recharts |

## Currency

- Sri Lankan Rupees (LKR)
- Stored as integers: 389900 = Rs 3,899.00
- Use `formatCurrency()` from `src/lib/utils.ts`

## Next.js 16 Rules

- `export const dynamic` is NOT allowed with `cacheComponents: true`
- Use `NextRequest` parameter or `export const instant = false` to force dynamic rendering
- Route handler params are `Promise<>` and must be awaited
- `useSearchParams()` requires a `<Suspense>` wrapper
- Middleware is deprecated — needs migration to `proxy` convention

## Code Style

- All pages use `"use client"` with mock/static data until APIs are wired up
- Zero border radius design (modernist aesthetic)
- Archivo font family (400/600/800 weights)
- Keep components small and focused
- No comments unless explaining a non-obvious "why"
