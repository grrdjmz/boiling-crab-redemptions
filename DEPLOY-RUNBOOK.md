# Deployment & Recovery Guide

This runbook outlines the steps to deploy the Boiling Crab Prize Redemption app to a hosting provider (e.g. Bolt) and how to perform basic maintenance and disaster recovery.  It assumes you have access to your Supabase project and the Bolt workspace.

## 1.  Prerequisites

1.  A **Supabase** project with the API URL, anon key, and service role key.
2.  A **Bolt** (or other Node‑compatible) hosting account with permission to create projects.
3.  The contents of this repository.  Ensure that `migrations/001_init.sql` and `package.json` are present.

## 2.  Setup Supabase

1.  Open Supabase and navigate to your project.
2.  Go to **SQL Editor** and run the migration script:
   ```sql
   -- paste the contents of migrations/001_init.sql
   ```
   This will create the `staff`, `prizes`, and `redemptions` tables, enable row‑level security, add a view, and seed a few initial rows.
3.  Under **Settings → API** copy your **Project URL**, **Anon Public Key**, and **Service Role Key**.
4.  (Optional) Rotate the service role key whenever necessary.  If rotated, update the environment variable `SUPABASE_SERVICE_ROLE_KEY` on the server.

## 3.  Create the Bolt project

1.  In your Bolt workspace, create a **new project** and import/upload the repository contents.
2.  Set the following secrets in the Bolt project’s **Secrets** interface:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your public anon key.
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key.
   - `ADMIN_PASSCODE` = a passcode only administrators should know.
   - `NEXT_PUBLIC_APP_URL` = the full domain where the app will be hosted (e.g. `https://prizes.example.com`).  This is required for QR generation.
3.  Configure the build command to:
   ```bash
   npm install
   npm run build
   ```
   and the start command to:
   ```bash
   npm run start
   ```

## 4.  Verify functionality

1.  **Manager form**: Visit `<your-domain>/form` and submit a test redemption.  A green banner should appear indicating success.
2.  **Admin panel**: Visit `<your-domain>/admin`, enter the passcode, and ensure you can view redemptions, create/deactivate staff and prizes, and export CSVs.
3.  **QR code**: Visit `<your-domain>/admin/qr` and verify the QR renders.  Download the PNG and test scanning it on a phone; it should open the manager form.
4.  **RLS & security**: Try sending a request directly to Supabase without the service key—this should fail.  All client calls should go through our API routes.

## 5.  Disaster recovery

In the event the application is lost or the keys are rotated:

1.  **Re‑deploy** the app from this repository.  Use the latest backup of your `.env` values or request new keys from Supabase.
2.  **Re‑run migrations** if deploying to a fresh database.  The migration file is idempotent (it uses `if not exists` and `on conflict`), so it can be run multiple times safely.
3.  **Restore secrets** in Bolt.  Make sure to update `NEXT_PUBLIC_APP_URL` if the domain changes.
4.  **Test connectivity** by loading `/form` and submitting a redemption.

Following this runbook ensures a smooth deployment and gives you a clear path to recovery should any critical component need to be recreated.