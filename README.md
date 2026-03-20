# Sponsor Complians

UK Sponsor Licence Compliance platform — built with React, Express, tRPC, and MySQL.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Radix UI, shadcn/ui
- **Backend**: Express, tRPC, Drizzle ORM
- **Database**: MySQL
- **Payments**: Stripe
- **Email**: SendGrid
- **Storage**: AWS S3
- **Auth**: Clerk (migration in progress)

## Getting Started

1. Clone and install dependencies:
   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. Run database migrations:
   ```bash
   pnpm run db:push
   ```

4. Start the dev server:
   ```bash
   pnpm run dev
   ```

## Deployment (Vercel)

The frontend builds as a static Vite app. The backend runs as a serverless function.

1. Push this repo to GitHub
2. Import the repo in Vercel
3. Set all environment variables from `.env.example` in Vercel project settings
4. Deploy

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Run production server
- `pnpm db:push` — Run database migrations
- `pnpm check` — TypeScript type checking
- `pnpm test` — Run tests
