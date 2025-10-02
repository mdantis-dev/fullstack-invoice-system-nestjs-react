# Altametrics — Monorepo (Frontend + Backend)

Two apps, one repo:
- **client/** – Vite + React + TS frontend (login, invoices list, modal details)
- **server/** – NestJS + Prisma + PostgreSQL backend (JWT auth, invoices API)


## Demo Credentials

Email: **demo@altametrics.test**  
Password: **Passw0rd!**

---

## Stack

**Frontend**
- Vite + React + TypeScript
- Redux Toolkit (auth/session)
- Axios (JWT interceptor)
- TanStack React Query (fetch/cache)
- Zod (validation)
- Tailwind CSS v4

**Backend**
- NestJS (TypeScript)
- PostgreSQL (Docker)
- Prisma (ORM/migrations/seed)
- Passport JWT (auth)
- class-validator / class-transformer (DTOs)
- Jest + Supertest (unit + e2e)
- ESLint (flat) + Prettier