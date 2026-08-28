# Aurelia House Admin Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a seeded, protected hotel-admin portal for booking management and guest check-in/check-out.

**Architecture:** Extend the Pages Functions/D1 backend with password-hash authentication, server-side sessions, protected booking queries, and idempotent stay transitions. Extend the React app with a route-aware admin sign-in, overview, and detail views.

**Tech Stack:** React, TypeScript, Vite, Cloudflare Pages Functions, Cloudflare D1, Web Crypto, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-08-28-hotel-booking-design.md`

## Global Constraints

- Admin data and guest PII require authenticated Pages Function responses.
- Password hashes, signing secrets, and sessions never enter local storage or client bundles.
- Seed admin: `admin@aureliahouse.my` / `AureliaDemo2026!`; document credential replacement.
- Check-in and check-out must be valid state transitions and recorded once in history.

---

### Task 1: Model admin and booking state in D1

**Files:**
- Create: `migrations/0002_admin_portal.sql`, `functions/lib/auth.ts`
- Test: `tests/auth.test.ts`

- [ ] Write failing tests for PBKDF2 hash verification and a signed session expiry check.
- [ ] Run `npm test -- --run tests/auth.test.ts`; verify missing-module failure.
- [ ] Implement Web Crypto PBKDF2 helpers and signed session-cookie parsing.
- [ ] Add `admins`, `admin_sessions`, and `booking_status_history` tables and indexes; seed the demo admin with a documented PBKDF2 hash.
- [ ] Run focused tests and `npm run build`.

### Task 2: Add protected admin APIs

**Files:**
- Create: `functions/api/admin/login.ts`, `functions/api/admin/logout.ts`, `functions/api/admin/bookings.ts`, `functions/api/admin/bookings/[id].ts`, `functions/api/admin/bookings/[id]/status.ts`
- Test: `tests/admin-status.test.ts`

- [ ] Write failing tests that reject unauthenticated requests and permit `demo_confirmed → checked_in → checked_out` exactly once each.
- [ ] Run focused tests and verify failure.
- [ ] Implement session validation, login/logout, booking queries, and state transitions with one history record per real change.
- [ ] Run focused tests and production build.

### Task 3: Build the admin sign-in and booking workspace

**Files:**
- Create: `src/admin/AdminApp.tsx`, `src/admin/AdminLogin.tsx`, `src/admin/BookingsDashboard.tsx`, `src/admin/BookingDetail.tsx`
- Modify: `src/main.tsx`, `src/styles.css`, `README.md`

- [ ] Write failing UI tests for login errors and the check-in/check-out call-to-action sequence.
- [ ] Run focused tests and verify failure.
- [ ] Implement route detection, sign-in form, filters, accessible booking table, detail drawer, and pending/error states.
- [ ] Add admin credentials and deployment-secret setup instructions to README.
- [ ] Run all tests, build, and visual verification at desktop/mobile widths.
