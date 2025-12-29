# BeautyHomeBySuzain Website Dashboard

Admin dashboard for editing the BeautyHomeBySuzain site content (text + images) via JSON APIs.

## Stack
- Next.js 14 (App Router)
- TailwindCSS
- TypeScript
- bcryptjs for simple credential check

## Requirements
- Node 18+
- Env vars: create `.env.local`
  ```
  DASHBOARD_USERNAME=beautyhome admin
  DASHBOARD_PASSWORD=GlamIsGolden8!
  NEXT_PUBLIC_SITE_ORIGIN=https://susan-makeup-artist-website.vercel.app
  ```
  - `NEXT_PUBLIC_SITE_ORIGIN` points to the live site API (`/api/content/{section}` and `/api/admin/dashboard`).
  - Add Vercel Blob/Storage keys later when wiring uploads.

## Scripts
- `npm install`
- `npm run dev` - start local dev at http://localhost:3000
- `npm run build` - production build
- `npm run start` - serve production build
- `npm run lint`

## Content model
- Website serves JSON per section at `/api/content/{section}`:
  - `home`, `about`, `services`, `packages`, `portfolio`, `contact`, `settings`
- Dashboard reads/writes via `PUT /api/content/{section}`.
- Image uploads use the site's image paths (Vercel Blob or existing /public assets).

## Authentication
- Static credentials checked server-side (bcrypt compare) at `POST /api/auth/login`.
- Session stored in a signed cookie; middleware protects `/dashboard`.

## Key files
- `app/dashboard/page.tsx` - dashboard shell
- `app/dashboardApp.tsx` - routing between dashboard, content manager, media manager, settings
- `components/ContentManager.tsx` - section picker tailored for BeautyHomeBySuzain
- `components/TextEditor.tsx` - form + JSON editor for home/about/services/packages/portfolio/contact
- `components/ImageManager.tsx` - "Portfolio Manager" for images/GIFs
- `components/SettingsPage.tsx` - profile/settings UI
- `lib/api.ts` - client helper for site API calls
- `app/api/auth/login/route.ts` - login handler
- `app/api/admin/dashboard/route.ts` - aggregates content timestamps for dashboard cards

## Favicon / branding
- `public/favicon.jpg` is used as the browser tab icon (set in `app/layout.tsx`).

## Deployment (Vercel)
1) Push to GitHub (main).
2) In Vercel, set environment variables (`DASHBOARD_USERNAME`, `DASHBOARD_PASSWORD`, `NEXT_PUBLIC_SITE_ORIGIN`, storage keys if any).
3) Trigger deploy; build runs `npm install && npm run build`.

## Troubleshooting
- ESLint peer deps: using `eslint@^9` to match `eslint-config-next@16`.
- If you see "Failed to update section," verify `NEXT_PUBLIC_SITE_ORIGIN` is reachable and the site API allows PUT from the dashboard domain (CORS).
- Ensure image paths used in JSON exist on the site (or uploaded to Blob).
