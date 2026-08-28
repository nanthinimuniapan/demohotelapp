# Aurelia House Hotel Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Cloudflare Pages hotel landing site with an accessible, demo-capable booking flow.

**Architecture:** React renders marketing and booking UI; Pages Functions provide availability and booking APIs. Cloudflare D1 stores seeded room data and demo booking records. A payment adapter defaults to demo confirmation and makes Curlec server-configured only.

**Tech Stack:** React, TypeScript, Vite, Cloudflare Pages Functions, Cloudflare D1, Vitest, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-08-28-hotel-booking-design.md`

## Global Constraints

- Deploy to Cloudflare Pages and remain compatible with Workers Free plan limits.
- Use D1 for availability holds and bookings with indexed parameterized queries.
- Do not place payment secrets or card data in browser code or D1.
- Demo payment is default and explicitly says it is a simulation.
- Curlec stays unavailable without server-side configuration.
- Use semantic controls, visible focus, labelled inputs, inline validation, and mobile-responsive layouts.

---

### Task 1: Scaffold the Vite application and booking utilities

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/lib/booking.ts`, `tests/booking.test.ts`

**Interfaces:**
- Produces `calculateStayTotal(rate, checkIn, checkOut)`, `validateGuest(input)`, and `createBookingReference()`.

- [ ] **Step 1: Write failing pricing and guest-validation tests**

```ts
expect(calculateStayTotal(480, '2026-09-10', '2026-09-12')).toBe(1056);
expect(validateGuest({ name: '', email: 'not-an-email', phone: '' })).toEqual({
  name: 'Enter your full name.', email: 'Enter a valid email address.', phone: 'Enter a mobile number.'
});
```

- [ ] **Step 2: Run `npm test -- --run tests/booking.test.ts` and verify failure because the module is absent.**

- [ ] **Step 3: Implement the minimal utility module**

```ts
export function calculateStayTotal(rate: number, checkIn: string, checkOut: string) {
  const nights = Math.max(1, (Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000);
  return Math.round(rate * nights * 1.1);
}
```

- [ ] **Step 4: Run `npm test -- --run tests/booking.test.ts && npm run build`; expect passing tests and `dist/`.**

### Task 2: Build the landing experience and design system

**Files:**
- Create: `src/data/hotel.ts`, `src/App.tsx`, `src/styles.css`, `tests/app.test.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces `App` with `onBook(roomId?: string)` and exports `Room` data for the wizard.

- [ ] **Step 1: Write a failing render test**

```ts
render(<App />);
expect(screen.getByRole('heading', { name: /a quieter kind of arrival/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: /stay at aurelia/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: /the house experience/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run `npm test -- --run tests/app.test.tsx`; expect failure because `App` is absent.**

- [ ] **Step 3: Implement the hero/search, hotel story, three room cards, signature services, location/social proof, and final booking CTA.**

```tsx
<main>
  <section id="stay" aria-labelledby="stay-heading">...</section>
  <section id="story" aria-labelledby="story-heading">...</section>
  <section id="rooms" aria-labelledby="rooms-heading">...</section>
  <section id="experiences" aria-labelledby="experiences-heading">...</section>
</main>
```

- [ ] **Step 4: Run `npm test -- --run tests/app.test.tsx && npm run build`; expect all landing landmarks.**

### Task 3: Implement the booking wizard and demo confirmation

**Files:**
- Create: `src/components/BookingWizard.tsx`, `tests/BookingWizard.test.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Interfaces:**
- Consumes `Room`, `calculateStayTotal`, and `validateGuest`.
- Produces `BookingWizard({ selectedRoomId, onClose })` and a booking API payload.

- [ ] **Step 1: Write failing flow tests**

```ts
render(<BookingWizard selectedRoomId="garden" onClose={vi.fn()} />);
await user.click(screen.getByRole('button', { name: /continue to guest details/i }));
expect(await screen.findByText('Enter your full name.')).toBeVisible();
await user.click(screen.getByLabelText(/demo payment/i));
expect(screen.getByText(/no payment will be collected/i)).toBeVisible();
```

- [ ] **Step 2: Run `npm test -- --run tests/BookingWizard.test.tsx`; expect failure because the wizard is absent.**

- [ ] **Step 3: Implement a progressive, accessible form**

```tsx
<form noValidate onSubmit={submitBooking}>
  <ol aria-label="Booking steps">...</ol>
  {step === 'details' && <GuestFields errors={errors} />}
  {paymentMode === 'demo' && <p role="note">Demo mode — no payment will be collected.</p>}
</form>
```

- [ ] **Step 4: Run wizard tests and build; expect invalid fields to block progress and valid demo flow to show a reference.**

### Task 4: Add Cloudflare D1 API and Pages configuration

**Files:**
- Create: `functions/api/availability.ts`, `functions/api/bookings.ts`, `migrations/0001_initial.sql`, `wrangler.jsonc`, `tests/functions/bookings.test.ts`
- Modify: `src/components/BookingWizard.tsx`, `README.md`

**Interfaces:**
- Consumes `POST /api/bookings` body `{ roomId, checkIn, checkOut, guests, guest, paymentMode, idempotencyKey }`.
- Produces `{ reference, status: 'demo_confirmed' }` or `409` when unavailable.

- [ ] **Step 1: Write a failing endpoint test**

```ts
expect(response.status).toBe(201);
expect(await response.json()).toMatchObject({ status: 'demo_confirmed' });
```

- [ ] **Step 2: Run `npm test -- --run tests/functions/bookings.test.ts`; expect the handler to be unavailable.**

- [ ] **Step 3: Add schema, binding, and parameterized transaction handler**

```sql
CREATE TABLE bookings (id TEXT PRIMARY KEY, reference TEXT UNIQUE NOT NULL, room_id TEXT NOT NULL, check_in TEXT NOT NULL, check_out TEXT NOT NULL, payment_mode TEXT NOT NULL, status TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL);
CREATE INDEX booking_dates ON bookings(room_id, check_in, check_out);
```

Demo requests create `demo_confirmed` bookings. Curlec calls must require Pages secrets and otherwise return a configuration error without confirming a booking.

- [ ] **Step 4: Run endpoint tests, `npm run build`, and `npx wrangler pages dev dist --d1=DB`; expect passing tests and local Pages startup.**

### Task 5: Verify the complete demo

**Files:**
- Modify: `README.md` only if verified commands differ.

- [ ] **Step 1: Run `npm test -- --run && npm run build`; expect all suites passing.**
- [ ] **Step 2: Inspect 375px and 1440px local renders; expect usable hero, room cards, and wizard.**
- [ ] **Step 3: Complete a demo booking, confirm itinerary/reference, and verify Curlec remains disabled with configuration copy.**
- [ ] **Step 4: Commit each independently verifiable task using the project’s configured Git author.**
