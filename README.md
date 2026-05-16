# Around The World 50s 🌎✈️

[![Website](https://img.shields.io/website?url=https%3A%2F%2Faroundtheworld50s.com)](https://aroundtheworld50s.com)

> A mother's journey around the world, powered by a full-stack platform built just for her ✨

## 📖 Overview

This is not just another travel blog - it's a love letter to technology making content creation accessible to everyone. Built specifically for my mother who loves sharing her adventures but isn't technical, this platform turns the complex world of web development into a beautiful, intuitive admin panel she can use from anywhere.

### 🎯 What Makes This Special

- **Full Admin Panel**: Rich text editor, image uploads, gallery management - all behind a secure login
- **Interactive World Map**: Every destination plotted on an interactive map with country flags
- **Dynamic Cover Photos**: Custom cover photo overrides per country/state, with smart fallbacks
- **Rich Blog Editor**: TipTap-powered editor with formatting, links, and embedded media
- **CDN-Powered Images**: All photos served through Cloudinary with automatic optimization
- **Zero Maintenance**: Push to main, Vercel deploys. That's it.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Database** | PostgreSQL via Supabase + Drizzle ORM |
| **Images** | Cloudinary CDN |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Supabase Auth (admin-only) |
| **Deployment** | Vercel (auto-deploy on push) |
| **Rich Text** | TipTap Editor |
| **Validation** | Zod |

## 🎨 Admin Interface

The admin interface is where all the magic happens - a secure, user-friendly dashboard for managing every aspect of the blog:

- **Blog Management** — Create, edit, and publish posts with a rich text editor, image uploads, and metadata controls
- **Gallery Management** — Curate the homepage gallery with drag-and-drop simplicity
- **Tips Management** — Share travel tips and advice organized by topic
- **Cover Photos** — Set custom hero images for any country or state page

## 🗺️ Architecture

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

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Requires `.env.local` — see `.env.example` for required variables.

## 📦 Deployment

Pushes to `main` auto-deploy to Vercel. No CI config, no build scripts, no manual steps. Just push and it's live.

---

Built with ❤️ for my mother, making her travel stories accessible to the world.
