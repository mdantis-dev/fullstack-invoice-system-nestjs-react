# Altametrics – Frontend (Vite + React + TS)

A small frontend that authenticates, lists invoices with pagination, and shows invoice details in a modal. Keep it lean, keep it fast.

## Demo Credentials

Email: demo@altametrics.test  
Password: Passw0rd!

## Stack

- Vite + React + TypeScript
- Redux Toolkit (auth/session)
- Axios (with JWT interceptor)
- TanStack React Query (data fetching/caching)
- Zod (form validation)
- Tailwind CSS v4 (styling)

## Features

- Login with Zod validation and clear auth errors
- JWT stored in Redux + `localStorage` (auto-restore on refresh)
- Protected routes (unauthenticated → `/login`)
- Invoices page with:
  - Server-side pagination (Prev/Next from API `meta`)
  - Row click → modal with invoice details
  - Loading, empty, and error states
- Axios interceptor injects `Authorization: Bearer <token>`
- Responsive layout (sticky topbar, table scroll for narrow screens)

## Prerequisites

- Node.js 18+ (LTS recommended)
- Backend running at `http://localhost:3000`

## Environment

Create `.env`:

~~~env
VITE_API_URL=http://localhost:3000
~~~

## Quick Start

~~~bash
# from repo root
cd client

# 1) install deps
npm install

# 2) env
cp .env.example .env
# ensure it contains:
# VITE_API_URL=http://localhost:3000

# 3) run dev
npm run dev
~~~

Open http://localhost:5173 and log in with the demo credentials.

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the prod build
- `npm run lint` – run ESLint

## Project Structure

~~~text
client/
  src/
    api/
      axios.ts                  # Axios instance + JWT interceptor
    app/
      store.ts                  # Redux store (auth slice) + persistence
    features/
      auth/
        Login.tsx               # Zod form + loginSuccess dispatch
        slice.ts                # token/user state, logout, selectors
      invoices/
        InvoiceModal.tsx        # invoice detail modal
        InvoicesPage.tsx        # table, pagination, empty/error/loading
        useInvoices.ts          # React Query hooks (list + detail)
    pages/
      BillsPage.tsx             # placeholder route
      ExpensesPage.tsx          # placeholder route
      HomePage.tsx              # post-login landing
      ReportsPage.tsx           # placeholder route
    routes/
      ProtectedRoute.tsx        # route guard + shell layout
    types/
      index.ts                  # Invoice, Meta, and shared types
    App.css                     # component styles (minimal)
    App.tsx                     # route layout
    index.css                   # Tailwind base/layers
    main.tsx                    # React root, providers, Router
    router.tsx                  # app routes (/login, /invoices, etc.)
  .env.example                  # template with required vars
  .gitignore
  eslint.config.js              # flat config (ESLint) + Prettier rules
  index.html                    # Vite entry HTML
  package.json
  package-lock.json
  postcss.config.js             # Tailwind / PostCSS
  README.md
  tailwind.config.ts            # Tailwind v4 config
  tsconfig.app.json             # TS config for app
  tsconfig.json                 # base TS config
  tsconfig.node.json            # TS config for tooling
  vite.config.ts                # Vite config
~~~

## API

The frontend expects these endpoints:

- `POST /auth/login` → `{ accessToken }`
- `GET /invoices?page=&limit=` → `{ data: Invoice[], meta }`
- `GET /invoices/:id` → `Invoice`

**Auth flow**

1. `POST /auth/login` with `{ email, password }`.
2. Save `accessToken` in Redux + `localStorage`.
3. Axios interceptor adds `Authorization: Bearer <token>` to subsequent requests.
4. On 401, logout and push to `/login`.
