# aroundtheworld50s

Travel blog for a couple exploring the world in their 50s. Built with Next.js 16, deployed on Vercel.

## Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: PostgreSQL via Supabase + Drizzle ORM
- **Images**: Cloudinary
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth (admin-only)

## Development

```bash
npm install
npm run dev
```

Requires `.env.local` — see `.env.example` for required variables.

## Deployment

Pushes to `main` auto-deploy to Vercel. No additional CI config needed.
