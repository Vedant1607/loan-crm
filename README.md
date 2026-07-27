# Sareen Powerz — Loan Aggregator CRM

A full-stack loan aggregation platform built for **Sareen Powerz Ltd**, connecting loan applicants (individuals, MSMEs, and small businesses) with partner NBFCs and lending institutions. Officers review applications, verify documents, and make lending decisions through a dedicated CRM portal.

## Overview

The platform supports four loan categories — **Personal, MSME/Business, Home, and Vehicle loans** — with a complete application lifecycle: submission, document upload, manual officer review, approval/rejection, EMI schedule generation, and repayment tracking.

Applications are automatically routed to the right lending partner using a reference ID system based on loan type, region, and current lender load.

> **Note:** AI-assisted document analysis (CIBIL scoring, bank statement parsing, automated risk scoring) is planned for a future phase. The platform currently operates in **manual review mode** — loan officers assess uploaded documents and make decisions directly.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (via Prisma ORM), hosted on Neon |
| Auth | NextAuth.js v5 (Auth.js) — Phone OTP-based login |
| File Storage | Vercel Blob |
| Deployment | Vercel |
| Monorepo | Turborepo + pnpm workspaces |

## Monorepo Structure
loan-crm/
├── apps/
│ └── web/ # Next.js app — frontend + API routes
├── packages/
│ ├── db/ # Prisma schema, client, and seed script
│ └── shared/ # Shared TypeScript types and constants
├── turbo.json
└── pnpm-workspace.yaml

## Core Features

### Applicant Portal (`/apply`)
- Phone OTP login
- Multi-step loan application form (personal details → loan details → business info for MSME → document upload → review & submit)
- Live EMI preview and FOIR (Fixed Obligation to Income Ratio) calculation during application
- Application status tracking with a visual progress tracker
- EMI repayment tracker with full installment schedule

### Lender / Loan Officer Portal (`/lender`)
- CRM dashboard with application queue and key stats
- Filterable applications list (status, loan type, search)
- Full application detail view — applicant info, loan details, uploaded documents
- Secure PAN reveal (AES-256-GCM encrypted at rest, decrypted on demand with audit logging)
- Approve / reject decision panel with automatic EMI schedule generation on approval
- EMI management — record borrower payments, track overdue installments
- Clients view — borrowers grouped with their application history

### Admin Panel (`/admin`)
- Platform-wide stats (total disbursed, EMI collected, approval rate, active lenders)
- Lender (NBFC) management — create, deactivate, auto-generate reference IDs
- User management — view all users, change roles

## Reference ID System

Lenders are assigned a reference ID on creation:
LDR-{LOAN_TYPE}-{STATE_CODE}-{SEQUENCE}
e.g. LDR-MSME-DL-0001


Applications get a unique number tied to their assigned lender:

APP-{LENDER_SHORT_CODE}-{YEAR}-{SEQUENCE}
e.g. APP-HDFC-NBFC-2025-000143

When an application is submitted, it's automatically routed to the lender best matching the loan type, applicant's state, and current application load across eligible lenders.

## Security & Compliance

- PAN numbers are encrypted at rest using **AES-256-GCM**; only the last 4 digits of Aadhaar are ever stored (per RBI data minimization guidance)
- Every PAN decryption is logged in the audit trail with the requesting user and timestamp
- Role-based access control enforced via middleware — Applicants, Loan Officers, Lender Admins, and Super Admins each see only what they're authorized to
- Full audit log of key actions (application submission, approval, rejection, role changes, lender status changes)

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- A PostgreSQL database (this project uses [Neon](https://neon.tech))
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store for document uploads

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.local.example apps/web/.env.local
# Fill in DATABASE_URL, DATABASE_URL_UNPOOLED, AUTH_SECRET, ENCRYPTION_KEY, BLOB_READ_WRITE_TOKEN

# Run database migrations
cd packages/db
pnpm db:generate
pnpm db:migrate

# Seed initial data (super admin + sample lenders)
pnpm db:seed

# Return to root and start the dev server
cd ../..
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

See `apps/web/.env.local` for the full list. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Neon Postgres connection strings |
| `AUTH_SECRET` | NextAuth session secret — generate with `openssl rand -base64 32` |
| `OTP_PROVIDER` | `MOCK` for local dev (logs OTP to console), swap for a real SMS provider in production |
| `ENCRYPTION_KEY` | 64-char hex string for AES-256 PAN encryption — generate with `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |

## Deployment

Deployed on Vercel with:
- Root directory: `apps/web`
- Build command: `cd ../.. && pnpm turbo run build --filter=@loan-crm/web`
- A root-level `postinstall` script (`prisma generate`) ensures the Prisma Client regenerates on every deploy, avoiding stale client issues from Vercel's dependency cache.

## Roadmap

- [ ] AI-assisted document analysis (CIBIL scoring, bank statement parsing, automated risk assessment)
- [ ] Real SMS OTP provider integration (currently mocked)
- [ ] Online EMI payments via payment gateway
- [ ] WhatsApp/SMS notifications for status updates
- [ ] DigiLocker integration for instant KYC document fetch

---

Built for **Sareen Powerz Ltd**.