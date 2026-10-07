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
- Auth: NextAuth.js with role-based access (CUSTOMER, MANAGER, ADMIN); `trustHost: true` is set for production
- Client pages fetch live data via the `useApi` hook (`src/hooks/use-api.ts`) against the `/api/*` routes; shared response types + mappers live in `src/types/api.ts`
- A few admin pages are still on mock data (see Build Status below)

## Core Flows

How the system is meant to work end-to-end (the business logic the services implement):

**Customer purchase:** browse/search → add to cart (Zustand `cart.store`, client-side) → checkout. On "Place order" the checkout saves the delivery address (`POST /api/addresses`), syncs the client cart to the server cart (`POST /api/cart/items`), then creates the order (`POST /api/orders`). Order is created with payment method (Stripe / COD / bank transfer); cart is cleared; customer lands on the order detail page. Note: the client Zustand cart and the server `Cart` table are two models the checkout bridges — a future refactor could move the whole cart flow onto the cart API.

**Order processing → stock deduction:** admin updates an order to DELIVERED → inside one Prisma transaction: set status, create an `InventoryTransaction` (STOCK_OUT) per item, decrement `Product.stockQuantity`, check reorder points for low-stock alerts, auto-generate the invoice, send confirmation email. All-or-nothing.

**Procurement (PO → GRN → stock-in):** low-stock alert → admin creates a Purchase Order (supplier + line items) → marks it SENT → goods arrive → admin creates a GRN against the PO (received/rejected qty per line) → confirming the GRN runs a transaction: create `InventoryTransaction` (STOCK_IN) per line, increment `Product.stockQuantity`, bump `POItem.receivedQty`, and set the PO to PARTIALLY_RECEIVED or FULLY_RECEIVED.

## Build Status & Roadmap

Full task list / roadmap artifact: https://claude.ai/artifact/GCamtX5BdSmsWeH4pRWGkr

- **Done:** schema (18 models), MUI UI, auth + roles, storefront wired (home, products, detail, category, search, cart, checkout, orders, addresses), 7 admin pages wired (dashboard, products, orders, inventory, suppliers, reports, invoices), seed data incl. sample orders.
- **Still on mock data (wire next):** admin order detail, product add/edit form, categories, purchase-orders (list/new/detail), GRN (list/new/detail), invoice detail, settings; account profile page; forgot/reset-password pages.
- **Not built yet (MUST for launch):** Stripe end-to-end + PDF invoices, Cloudinary product image upload, email notifications (Resend), password-reset flow, admin staff management, security hardening (middleware→proxy route protection, rate limiting, CSP), production deploy.
- **Stack note:** the planning docs suggest FastAPI + React/Vite — ignore that; the app is Next.js 16 + Prisma + MUI + NextAuth and stays that way. Treat the client requirements doc as a feature checklist only.

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
