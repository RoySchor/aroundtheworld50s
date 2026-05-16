# Around The World 50s 🌎✈️

[![Website](https://img.shields.io/website?url=https%3A%2F%2Faroundtheworld50s.com)](https://aroundtheworld50s.com)

> A mother's journey around the world, powered by a full-stack platform built just for her

## Overview

This is not just another travel blog - it's a love letter to technology making content creation accessible to everyone. Built specifically for my mother who loves sharing her adventures but isn't technical, this platform turns the complex world of web development into a beautiful, intuitive admin panel she can use from anywhere.

### What Makes This Special

- **Full Admin Panel**: Rich text editor, image uploads, gallery management - all behind a secure login
- **Interactive World Map**: Every destination plotted on an interactive map with country flags
- **Dynamic Cover Photos**: Custom cover photo overrides per country/state, with smart fallbacks
- **Rich Blog Editor**: TipTap-powered editor with formatting, links, and embedded media
- **CDN-Powered Images**: All photos served through Cloudinary with automatic optimization
- **Zero Maintenance**: Push to main, Vercel deploys. That's it.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js, React |
| **Database** | PostgreSQL via Supabase + Drizzle ORM |
| **Images** | Cloudinary CDN |
| **Styling** | Tailwind CSS v4 |
| **Deployment** | Vercel |

## Admin Interface

The admin interface is where all the magic happens - a secure, user-friendly dashboard for managing every aspect of the blog:

- **Blog Management** — Create, edit, and publish posts with a rich text editor, image uploads, and metadata controls
- **Gallery Management** — Curate the homepage gallery with drag-and-drop simplicity
- **Tips Management** — Share travel tips and advice organized by topic
- **Cover Photos** — Set custom hero images for any country or state page

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── destinations/       # Interactive world map + country pages
│   ├── blog/               # Blog posts (dynamic routes)
│   ├── tips/               # Travel tips
│   ├── about/              # About page
│   ├── admin/              # Protected admin panel
│   │   ├── blog/           # Post CRUD + rich text editor
│   │   ├── gallery/        # Homepage gallery management
│   │   ├── tips/           # Tips CRUD
│   │   └── cover-photos/   # Country/state cover overrides
│   └── login/              # Auth
├── components/             # React components by feature
├── server/
│   ├── actions/            # Server actions
│   ├── repositories/       # Database queries (Drizzle)
│   ├── services/           # Business logic
│   ├── validators/         # Zod schemas
│   ├── db/                 # Schema + migrations
│   └── auth/               # Supabase auth helpers
└── lib/                    # Shared utilities
```

## Getting Started

```bash
npm install
npm run dev
```

Requires `.env.local` — see `.env.example` for required variables.

## Admin Page 
Since you have to be an admin to view, here's a glimpse of its glory.

<img width="1716" height="874" alt="image" src="https://github.com/user-attachments/assets/3d624eb5-438d-4b03-a309-e9ab2897c199" />

<img width="1467" height="786" alt="image" src="https://github.com/user-attachments/assets/f3ac0f55-addd-400c-b79e-5cac35e32abc" />

<img width="1459" height="705" alt="image" src="https://github.com/user-attachments/assets/2eb8c219-cfe4-4e79-bab2-5d3229d3492a" />



---

Built with ❤️ for my mother, making her travel stories accessible to the world.
