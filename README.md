#Altametrics - Fullstack Invoice System – NestJS + React

This repository contains a **full-stack technical assessment project** implemented as a monorepo.
The goal of the assignment was to demonstrate the ability to design and implement a small production-style application using modern **TypeScript backend and frontend tooling**.

The system includes:

- A **NestJS backend API**
- A **React + Vite frontend**
- **PostgreSQL database with Prisma ORM**
- **JWT authentication**
- Docker-based local database setup

The project demonstrates clean architecture, authentication flows, API design, and modern frontend data management.

---

# Repository Structure

```
/root
│
├── client/   → Vite + React + TypeScript frontend
└── server/   → NestJS backend API
```

Both applications live in a single **monorepo**, making it easier to manage development and dependencies.

---

# Project Overview

The application implements a simple **invoice management system**.

Users can:

• Authenticate using email and password
• View a list of invoices
• Open a modal to inspect invoice details

The goal of the exercise was to demonstrate backend architecture, authentication, and frontend integration rather than pixel-perfect UI.

---

# Demo Credentials

The database is automatically seeded using Prisma.

```
Email: demo@altametrics.test
Password: Passw0rd!
```

---

# Technology Stack

## Frontend

- Vite
- React
- TypeScript
- Redux Toolkit (authentication/session state)
- Axios (API requests + JWT interceptor)
- TanStack React Query (data fetching and caching)
- Zod (validation)
- Tailwind CSS v4

---

## Backend

- NestJS
- TypeScript
- PostgreSQL (Docker)
- Prisma ORM (schema, migrations, seed)
- Passport JWT authentication
- class-validator / class-transformer
- Jest + Supertest (unit + e2e testing)
- ESLint + Prettier

---

# Backend API

## Authentication

### POST `/auth/login`

Authenticates a user and returns a **JWT token** used for accessing protected routes.

---

## Invoices

### GET `/invoices`

Returns all invoices belonging to the authenticated user.

### GET `/invoices/:id`

Returns detailed information for a specific invoice.

---

# Database Schema

## User

| Field | Type |
|------|------|
| id | UUID |
| email | string |
| password | string |
| name | string |

---

## Invoice

| Field | Type |
|------|------|
| id | UUID |
| vendor_name | string |
| amount | number |
| due_date | date |
| description | string |
| user_id | UUID |
| paid | boolean |

---

# Frontend Architecture

The frontend application includes two primary routes.

### Login Page

Allows the user to authenticate using seeded credentials.

### Invoices Page

Displays invoices retrieved from the backend.

Each row can be clicked to open a **modal displaying invoice details**.

---

# Frontend Components

| Component | Description |
|--------|-------------|
| InvoiceList | Displays invoice table |
| InvoiceModal | Shows detailed invoice data |
| LoginForm | Handles authentication |

---

# Features Implemented

• JWT authentication flow
• API communication using Axios
• Data caching with React Query
• Global auth state with Redux Toolkit
• Schema validation with Zod
• Docker PostgreSQL environment
• Prisma migrations and database seeding

---

# Running the Project

## 1 Install dependencies

```
npm install
```

or

```
pnpm install
```

---

## 2 Start PostgreSQL with Docker

```
docker compose up -d
```

---

## 3 Run database migrations

```
npx prisma migrate dev
```

---

## 4 Seed the database

```
npx prisma db seed
```

---

## 5 Start backend

```
cd server
npm run start:dev
```

---

## 6 Start frontend

```
cd client
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Testing

Backend tests are implemented using **Jest + Supertest**.

```
npm run test
```

Tests cover authentication and invoice endpoints.

---

# Notes

This project represents a **technical assessment implementation** completed within a limited timeframe.

The focus of the exercise was to demonstrate:

- Backend architecture
- Authentication
- API design
- Frontend integration
- Clean project structure

rather than building a full production application.

---

# Author

**Dantis Minurland Constantin**
Full-Stack Software Developer

🌐 https://mdantis.dev
✉️ hello@mdantis.dev

---

# License

This project is licensed under the **MIT License**.
