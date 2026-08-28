# Aurelia House

Cloudflare Pages hotel booking demonstration.

## Local development

```bash
npm install
npm run dev
```

The browser flow defaults to an explicit demo payment and never collects a card. For Cloudflare deployment, create a D1 database, replace `database_id` in `wrangler.jsonc`, then apply `migrations/0001_initial.sql` with Wrangler. Pages serves the Vite `dist/` folder and exposes `functions/api/*` automatically.

Live Razorpay Curlec must be connected from a server-only order endpoint and a signature-verifying webhook before a booking is marked paid; never expose the provider secret in the browser.
