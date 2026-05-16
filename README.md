# VendorProof Web

Public-facing web app for VendorProof, built with Next.js App Router.

This app powers:

- Vendor marketplace discovery
- Public vendor trust profiles
- Public payment links and checkout handoff
- Payment verification receipt pages
- Public buyer rating pages

It consumes the VendorProof backend API (documented in docs.yaml) via a shared Axios client.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Query (TanStack Query)
- Axios
- Framer Motion + Lenis

## Prerequisites

Install the following before running locally:

- Node.js 20+ (recommended: latest LTS)
- npm 10+

Check installed versions:

node -v
npm -v

## Environment Variables

This frontend currently requires one runtime env variable:

- NEXT_PUBLIC_API_URL

Used by the HTTP client in lib/config/http.config.ts as the backend base URL.

Create a file named .env.local in the project root with:

NEXT_PUBLIC_API_URL=https://vendorproof.oluwadunsin.dev/api

Notes:

- If NEXT_PUBLIC_API_URL is missing, the app falls back to https://vendorproof.oluwadunsin.dev/api.
- Because this is a NEXT_PUBLIC variable, it is exposed to the browser bundle by design.
- Do not put secrets in NEXT_PUBLIC variables.

## Quick Start (Developer Setup)

1.  Install dependencies:

npm install

2.  Add env file:

    Create .env.local in the project root and add:

    NEXT_PUBLIC_API_URL=http://localhost:4000/api

Then update it if your backend runs on a different host/port.

3.  Start the dev server:

npm run dev

4.  Open:

http://localhost:3000

## Scripts

- npm run dev
  Starts Next.js in development mode.

- npm run build
  Builds production assets.

- npm run start
  Runs the production server (after build).

## Local Development Flow

Run frontend only:

1. Ensure backend API is running and reachable at NEXT_PUBLIC_API_URL.
2. Run npm run dev.
3. Open homepage and test route-level pages (see Route Map below).

Production-like local run:

1. npm run build
2. npm run start

## Route Map (Public App)

- /
  Marketplace page (vendor listing + search/filter)

- /vendor/[vendorSlug]
  Public vendor profile page

- /pay/[token]
  Public payment page for a vendor payment token

- /payment/verify?reference=...
  Payment verification receipt page

- /rate/[ratingToken]
  Buyer rating page after payment

## API Dependency

The app is API-driven. Core requests include:

- GET /business
- GET /business/{slug}
- GET /pay/{token}
- POST /pay/{token}
- GET /pay/verify/{reference}
- GET /pay/rate/{ratingToken}
- POST /pay/rate/{ratingToken}

See docs.yaml for the full backend OpenAPI specification.

## Project Structure (Key Areas)

- app/
  Next.js App Router entrypoints and routes

- components/ui/
  Page-level and feature UI components

- lib/service/
  API service modules and response mapping

- lib/config/http.config.ts
  Shared Axios instance and baseURL config

- docs.yaml
  Backend API contract consumed by this frontend

## Troubleshooting

If the app loads but data does not appear:

- Confirm NEXT_PUBLIC_API_URL is correct.
- Confirm backend is running and CORS allows this frontend origin.
- Open browser DevTools Network tab and inspect failed API calls.

If pages return not found unexpectedly:

- Verify dynamic route params are valid (token, vendorSlug, ratingToken).
- Verify backend returns 200 for the corresponding endpoint.

If env changes are not reflected:

- Restart the dev server after editing .env.local.

## Notes for Contributors

- Keep API mapping logic in lib/service instead of inside UI components.
- Prefer strong typing for API payloads and response mappers.
- Keep route pages thin and push behavior into components/services.

## Reference Docs

- Product and vision details: INFO.MD
- UI design direction: DESIGN.MD
- API specification: docs.yaml
