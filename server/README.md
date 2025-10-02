<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# Altametrics – Backend (NestJS + Prisma + PostgreSQL)

Small backend that authenticates users with JWT, lists invoices (with pagination), and returns invoice details. Clean structure, strict typing, and tests.

## Stack

- NestJS (TypeScript)
- PostgreSQL (via Docker)
- Prisma ORM (schema, migrations, seed)
- Passport JWT (auth)
- class-validator / class-transformer (DTO validation)
- Jest + Supertest (unit + e2e tests)
- ESLint (flat config) + Prettier

## Features

- `POST /auth/login` -> returns `accessToken` (JWT)
- `GET /invoices` -> paginated list with `meta { page, limit, total, pages }`
- `GET /invoices/:id` -> invoice detail (auth required)
- DTO validation (login + pagination)
- Seed script creates a demo user and sample invoices
- Tests: service unit tests and full HTTP e2e test
- Optional snippets: request logging middleware, Prisma exception filter, pagination DTO

## Prerequisites

- Node.js 18+
- Docker Desktop (Postgres runs in Docker)

## Environment

Create `server/.env`:

```env
# Postgres (from docker-compose)
DATABASE_URL=postgresql://app:app@localhost:5432/appdb

# JWT
JWT_SECRET=dev_change_me

# App port (optional)
PORT=3000 
```

## Quick Start

~~~bash
# from repo root
docker compose up -d          # starts postgres:16

cd server

# generate Prisma client and apply schema
npx prisma generate
npx prisma migrate dev -n init

# seed demo data (user + invoices)
npm run prisma:seed

# start dev server (http://localhost:3000)
npm run start:dev
~~~

## Verify Quickly

~~~bash
# login
$body = @{ email="demo@altametrics.test"; password="Passw0rd!" } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body $body
$token = $resp.accessToken

# list invoices
Invoke-RestMethod -Uri "http://localhost:3000/invoices?page=1&limit=5" -Headers @{ Authorization = "Bearer $token" }

# get one invoice
Invoke-RestMethod -Uri "http://localhost:3000/invoices/1" -Headers @{ Authorization = "Bearer $token" }
~~~

## API
Base URL: http://localhost:3000

## Auth
~~~bash
POST /auth/login
~~~

Request body
~~~json
{ "email": "demo@altametrics.test", "password": "Passw0rd!" }
~~~

Response
~~~json
{ "accessToken": "<jwt>" }
~~~

Errors: `401 Unauthorized` on bad email/password. DTO validation errors return `400`.

## Invoices

Requires header: `Authorization: Bearer <token>`

### GET /invoices

Request
~~~bash
GET /invoices?page=1&limit=10
# Headers:
# Authorization: Bearer <token>
~~~

Response
~~~json
{
  "data": [
    {
      "id": 1,
      "vendor_name": "ACM Supplies",
      "amount": 199.99,
      "due_date": "2025-10-01T08:41:36.413Z",
      "description": "Office chairs",
      "paid": false,
      "user_id": 1
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 12, "pages": 2 }
}
~~~

### GET /invoices/:id

Request
~~~bash
GET /invoices/1
# Headers:
# Authorization: Bearer <token>
~~~

Response
~~~json
{
  "id": 1,
  "vendor_name": "ACM Supplies",
  "amount": 199.99,
  "due_date": "2025-10-01T08:41:36.413Z",
  "description": "Office chairs",
  "paid": false,
  "user_id": 1
}
~~~

Errors: `404 Not Found` if the invoice is missing or not owned by the current user.

## Scripts
~~~bash
# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Dev / build
npm run start:dev
npm run build
npm run start:prod

# Tests
npm run test           # unit
npm run test:watch
npm run test:cov
npm run test:e2e       # seeds auto-run via pretest:e2e

# Lint / format
npx eslint . --fix
npx prettier --write .
~~~

## Project Structure

~~~text
server/
  prisma/
    schema.prisma
    seed.ts
  src/
    auth/
      auth.controller.ts
      auth.module.ts
      auth.service.ts
      auth.service.spec.ts
      jwt-auth.guard.ts
      jwt.strategy.ts
      jwt.types.ts
    invoices/
      invoices.controller.ts
      invoices.module.ts
      invoices.service.ts
      invoices.service.spec.ts
    prisma/
      prisma.module.ts
      prisma.service.ts
    app.controller.ts
    app.controller.spec.ts
    app.module.ts
    app.service.ts
    main.ts
  test/
    app.e2e-spec.ts
    jest-e2e.json
  .env
  jest.config.ts
  eslint.config.mjs
  tsconfig.json
  tsconfig.build.json
  tsconfig.eslint.json
  tsconfig.spec.json
  package.json
~~~

## Implementation Notes

- Auth: JWT via Passport; token read from Authorization: Bearer <token>.
- Validation: class-validator with global ValidationPipe (whitelist + forbidNonWhitelisted).
- Pagination: page and limit query params; response includes meta.total and meta.pages.
- Seeding: Prisma seed creates the demo user and multiple invoices.
- Ownership: all invoice reads are scoped to the authenticated user.
- CORS: default Nest CORS is fine for the local frontend.
