# Boiling Crab Prize Redemption App

This is a full‑stack web application for managing prize redemptions at **The Boiling Crab — K St (Sacramento)**.  It’s built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and uses **Supabase** as the database.  The goal is to allow managers to quickly record a prize redemption and for administrators to manage staff, prizes and view redemptions.

## Features

- **Manager Form** (`/form`) — A mobile‑friendly form that allows a manager to record a redemption.  It includes:
  - Staff dropdown (loads active staff via API).
  - Prize dropdown (loads active prizes via API).
  - Redemption date picker (defaults to today).
  - Manager name field (remembered in `localStorage` for convenience).
  - Submits to a server‑side function which writes directly to Supabase using the service role key; no keys are ever exposed client‑side.

- **Admin Panel** (`/admin`) — Protected by a passcode (stored in `sessionStorage`) so only authorized users can access:
  - **Redemptions table** with date‑range and staff/prize filters.  Supports CSV export.
  - **Staff** management — create, list and (de)activate staff.
  - **Prizes** management — create, list and (de)activate prizes.
  - **QR & Links** — shows the public form URL and generates a QR code PNG for easy sharing.

- **API routes** under `/api/…` implement all database actions.  Each admin route requires a `X‑Admin‑Passcode` header which is validated on the server.  The passcode value is stored in the `ADMIN_PASSCODE` environment variable and never shipped to the client.

- **Database schema** (see `migrations/001_init.sql`): tables for `staff`, `prizes` and `redemptions`, plus a `redemptions_view` for convenient joins.  Row‑level security (RLS) is enabled and all tables default to deny.  All inserts/updates occur via our server functions using the Supabase service role key.

## Getting started

1.  **Install dependencies** (requires Node ≥ 18):
   ```bash
   npm install
   ```

2.  **Create a `.env.local` file** at the project root and add your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSCODE=your-admin-passcode
   NEXT_PUBLIC_APP_URL=https://your-deployed-domain
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` come from the Supabase **Settings → API** page.
   - `SUPABASE_SERVICE_ROLE_KEY` is the secret service role key from the same page; this must never be exposed client‑side.
   - `ADMIN_PASSCODE` is a passphrase you choose to protect the admin panel.
   - `NEXT_PUBLIC_APP_URL` should be set to the full domain of your deployed app (e.g. `https://boilingcrab.example.com`).  It is used for generating the QR code URL.

3.  **Apply database migrations** to your Supabase project.  You can run the SQL script manually in the Supabase SQL editor or via the Supabase CLI:
   ```bash
   supabase db remote < migrations/001_init.sql
   ```

4.  **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` and will automatically reload on changes.

5.  **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

## Deployment

Deploy the Next.js app on Bolt or any Node‑compatible hosting.  Ensure the environment variables listed above are set in your hosting provider’s secret manager.  If deploying on Bolt:

1.  Create a new Bolt project and upload this repository.
2.  Set the secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSCODE`, `NEXT_PUBLIC_APP_URL`).
3.  Run `npm install && npm run build` in the build step.
4.  Serve the `.next` folder using Node (`npm run start`).

Refer to `DEPLOY-RUNBOOK.md` for a step‑by‑step deployment guide and disaster recovery notes.