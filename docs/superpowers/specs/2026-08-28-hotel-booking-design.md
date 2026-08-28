# Aurelia House Hotel Booking Demo — Design

## Goal

Create a polished, responsive landing and booking experience for the fictional boutique hotel **Aurelia House**, deployable on the Cloudflare Free plan. Visitors first discover the hotel’s story, setting, services, and rooms, then can search availability, enter guest details, choose payment, and receive a booking confirmation without needing a live payment account.

## Experience

The site is a single-page storytelling experience with an anchored booking panel and dedicated booking route. The landing page builds desire before asking for a conversion:

1. **Hero and availability:** the hotel promise, a destination-led image, and an unobtrusive date/guest search.
2. **Our story:** the property’s background, design ethos, and location in a short editorial narrative.
3. **Stay at Aurelia:** three room types with imagery, capacity, amenities, and starting price.
4. **The house experience:** signature dining, wellness, airport transfer, concierge, and tailored local experiences.
5. **Location and social proof:** nearby landmarks, guest quote, policies, and final booking call-to-action.

The search and every booking call-to-action lead into a progressive booking flow that keeps dates, guests, price, and room selection visible.

The booking progression is:

1. Select dates and guests.
2. Choose one of three room types.
3. Add guest contact details.
4. Select **Demo payment** or **Razorpay Curlec**.
5. Confirm and show a reference-number success state.

## Cloudflare-first technology and structure

Use a React + TypeScript application built with Vite and deployed as a Cloudflare Pages project. Static landing assets are served by Pages; booking APIs run as Pages Functions, which share the Workers Free request quota. The build should have no paid platform dependency.

Use Cloudflare D1 (SQLite) for bookings and availability holds. A short, indexed schema contains rooms, rate plans, bookings, and booking guests. The demo remains comfortably within the Workers Free allowance: the platform currently provides 100,000 Worker/Pages Function requests per day, while D1 Free includes 5 million daily rows read, 100,000 daily rows written, and 5 GB total storage. Static asset delivery does not consume Function requests. These limits are appropriate for a demonstration and small pilot, but production demand must be monitored before traffic grows.

The app is organized as:

- `src/`: landing and booking UI, local client state, design tokens, and accessible shared controls.
- `functions/api/`: availability look-up, booking creation, and payment-order endpoints.
- `migrations/`: D1 schema and seed data.
- `wrangler.jsonc`: Pages/D1 binding and local development configuration.

The design system is authored in CSS custom properties and a small set of reusable primitives (buttons, form fields, room cards, booking step indicator, and booking summary).

The payment layer is modeled as a small adapter. Demo mode creates a clearly labelled demo booking; the Curlec option uses a server-side Pages Function to create an order only when its secret credentials have been configured. The browser receives only a public key/order reference; no secret, key, or customer card data is stored in client code or D1.

## Visual direction

Aurelia House uses an editorial, sun-warmed look: deep evergreen and charcoal grounds, parchment surfaces, muted terracotta highlights, and generous serif display typography paired with restrained sans-serif body copy. The UI should feel like a considered hospitality brand, rather than a generic travel marketplace.

## Data and validation

Room content, nightly rates, booking fees, and amenities are local demo data. Dates default to a future two-night stay. Required guest fields are validated inline with accessible labels and error text. The confirmation gives a generated booking reference and a compact itinerary.

## Payment and booking behavior

- **Demo payment (default):** submits to the booking endpoint with `payment_mode=demo`, records a `demo_confirmed` booking status, and presents an explicit demo notice. It makes no payment-provider request.
- **Razorpay Curlec:** a Pages Function validates server-only environment secrets, creates the provider order, and returns the data needed to open the provider checkout. A verification webhook/function must confirm the provider signature before a booking becomes `paid`.
- If Curlec is not configured, its option remains informative but unavailable; it can never mimic a successful external payment.
- Booking submission is disabled while being processed to avoid duplicate confirmations.

## Free-tier safeguards

- Serve hotel imagery as optimized static assets; do not introduce a paid image API or server-side image transformation requirement.
- Validate availability and create the booking in one server-side D1 transaction, with an idempotency key to prevent duplicate records.
- Use indexed date/room lookups and small, paginated administrative result sets to avoid unnecessary row reads.
- Keep the Worker under Free-plan CPU and subrequest limits; payment is the only external request in a live flow.
- Surface a friendly retry state if a Cloudflare daily limit is reached. This is a demo/pilot architecture, not a guarantee of unlimited free production capacity.

## Responsive and accessibility requirements

The landing page stays readable from mobile to desktop; the booking panel becomes a full-width stacked flow on smaller screens. Controls use native semantic elements, keyboard-visible focus states, labeled inputs, accessible error associations, and a live success status. Color is never the only success or validation indicator.

## Verification

Run the project’s type/build checks and a Cloudflare Pages local build. Inspect the rendered desktop and mobile layouts, and exercise the demo flow from landing-page availability search through confirmation. Verify invalid guest submissions render field-level errors, the booking endpoint rejects unavailable dates, and the Curlec option cannot create a payment without server-side configuration.
