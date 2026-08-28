# Aurelia House

Cloudflare Pages hotel booking demonstration. It includes a full landing page and demo booking flow; demo payments never collect a card.

## Local development

```bash
npm install
npm run dev
```

For a local Pages Functions + D1 preview, build first and then run:

```bash
npm run build
npx wrangler pages dev dist
```

## Deploy to Cloudflare Pages

This project contains a `functions/` directory, so deploy it with Wrangler (not dashboard drag-and-drop). Wrangler uploads the built `dist/` assets and automatically includes the Pages Functions.

1. Log in to the Cloudflare account that will own the site:

   ```bash
   npx wrangler login
   ```

2. Create a D1 database and copy the returned `database_id`:

   ```bash
   npx wrangler d1 create aurelia-house
   ```

3. Update [wrangler.jsonc](./wrangler.jsonc): replace `replace-with-your-d1-id` with the database ID from the preceding command. Keep the binding name as `DB` because the Pages Functions use that exact binding.

4. Apply the booking schema and seed rooms to the remote database:

   ```bash
   npx wrangler d1 execute aurelia-house --remote --file=migrations/0001_initial.sql
   ```

5. Build and make the first production deployment. Replace `aurelia-house-booking` with an available Pages project name if needed:

   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=aurelia-house-booking
   ```

   Wrangler will create the Pages project if necessary and print its `*.pages.dev` URL. Subsequent production deployments use the same command. A preview deployment can be created with `--branch=preview`.

6. In Cloudflare Dashboard → Workers & Pages → your project, verify the `DB` D1 binding appears under Settings. Redeploy after any binding changes.

## Deploy from GitHub

Use this route when every push should build and deploy automatically. GitHub-connected Pages projects provide preview URLs for non-production branches and pull requests.

1. Create a GitHub repository and push this project, including `package-lock.json`, `functions/`, `migrations/`, and `wrangler.jsonc`:

   ```bash
   git init
   git add .
   git commit -m "Initial Aurelia House site"
   git branch -M main
   git remote add origin https://github.com/YOUR-ACCOUNT/aurelia-house-booking.git
   git push -u origin main
   ```

2. In Cloudflare Dashboard, open **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**. Install/authorize the Cloudflare Workers & Pages GitHub App if prompted, then select the repository.

3. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | Vite (or None with the values below) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | leave empty (repository root) |

4. Before the first deployment, create the D1 database and apply the migration from a logged-in local terminal, then replace the placeholder `database_id` in `wrangler.jsonc` and push that change:

   ```bash
   npx wrangler d1 create aurelia-house
   npx wrangler d1 execute aurelia-house --remote --file=migrations/0001_initial.sql
   git add wrangler.jsonc
   git commit -m "Configure Cloudflare D1 binding"
   git push
   ```

5. Click **Save and Deploy**. Cloudflare installs dependencies, runs the build, deploys `dist/`, and detects the repository’s `functions/` directory. Each later push to `main` updates production; pushes and pull requests on other enabled branches receive preview deployments.

6. If the deployment cannot access D1, open the Pages project’s **Settings** and ensure the D1 binding is named `DB`, then trigger a redeploy. Check **Deployments → View details → Build log** for build failures.

> A Pages project is created either through Git integration or Direct Upload; Cloudflare does not let a Direct Upload project later switch to Git integration. Create a separate Pages project if you initially chose the Direct Upload route above.

## Payment modes

- **Demo payment:** enabled by default and stores a `demo_confirmed` booking without contacting a payment provider.
- **Razorpay Curlec:** intentionally unavailable in this demo. Before enabling it, add a server-side order endpoint, configure the provider secret as a Cloudflare secret, and verify the provider webhook signature before setting a booking to `paid`. Never expose the provider secret or card details in browser code, D1, or source control.

## Free-tier note

The architecture uses Pages, Pages Functions, and D1, all supported on the Cloudflare Free plan. Monitor daily Worker/Pages Function requests and D1 reads/writes as traffic grows. This demo is designed for the free tier, not an unlimited-traffic guarantee.
