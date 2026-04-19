# Social Embed Block: Instagram & TikTok

Working plan for a new `social_embed` blog content block that renders Instagram posts and TikTok videos inline.

Last updated: 2026-04-19

---

## Design Decisions

**Approach: DIY client-side embed.js (zero dependencies)**

Both platforms provide embed scripts that transform a blockquote into a rendered embed widget. No Meta developer account, no TikTok developer account, no API keys, no app review required.

We build a single `SocialEmbedBlock.tsx` component with platform-specific logic:
- **Instagram**: Loads `//www.instagram.com/embed.js` once, calls `window.instgrm.Embeds.process()` in useEffect on each mount/URL change
- **TikTok**: Loads `//www.tiktok.com/embed.js` with a cache-busted `?t=` query param on each mount (TikTok has no manual re-init API)

**Why DIY over `react-social-media-embed`:**
The library pulls 6 transitive dependencies (react-twitter-embed, react-youtube, @types/youtube-player, classnames, react-html-props, react-sub-unsub) for two embeds we actually use. The two real problems (Instagram re-init + TikTok script reload) are each ~10 lines in a custom component. Last published Feb 2025 (14 months ago).

**Data model:** Single `social_embed` block type with `{ platform: "instagram" | "tiktok", url: string }`. Platform is stored explicitly rather than auto-detected for rendering efficiency, but cross-validated against URL hostname via superRefine.

**Error handling:** React error boundary wraps all embeds. Fallback is a styled link to the original post — degraded but functional. Third-party embed scripts can fail (network, invalid URL, script changes); this prevents one broken embed from crashing the entire block list.

**Admin preview:** Triggered by explicit "Preview Embed" button, not on every keystroke. Instagram's embed.js is not designed for rapid re-initialization.

---

## Current State (baseline)

- Blog content block system with 5 types: `text`, `two_column`, `image_grid`, `image_carousel`, `itinerary_with_map`
- Blocks stored in `blog_blocks` table with JSONB `data` column
- Zod discriminated union validates block shapes at API boundary
- `BlockRenderer` switch dispatches to per-type React components
- `BlocksSection` has type labels and "Add block" buttons per type
- `BlockForm` handles create/edit for all block types with type-specific form sections

---

## Implementation

### 1. Migration — extend pgEnum

```sql
ALTER TYPE blog_block_type ADD VALUE 'social_embed';
```

Shipped via Supabase MCP (already applied to production DB). Migration file: `0006_add_social_embed_type.sql`. Zero risk — adding an enum value doesn't affect existing rows.

### 2. Schema + validator changes

**`src/server/db/schema.ts`:**
- Added `"social_embed"` to blogBlockType pgEnum
- Removed stale "instagram is deliberately omitted" docblock note (L1)
- Added JSONB shape documentation for social_embed (L2)

**`src/server/validators/blog.ts`:**
- Added `socialEmbedBlockFields`: `{ platform: z.enum(["instagram", "tiktok"]), url: z.string().url() }`
- Added union branch: `z.object({ type: z.literal("social_embed"), ...socialEmbedBlockFields })`
- Added superRefine cross-validation: URL hostname must match platform (M1)
- Exported `SocialEmbedBlockData` type
- Updated `BlockType` union

**`src/types/blog.ts`:**
- Added `SocialEmbedBlockData` to re-exports

### 3. Renderer component

**`src/components/blog/blocks/SocialEmbedBlock.tsx`** (NEW, `'use client'`)

Structure:
- `EmbedErrorBoundary` — class component, catches render errors, shows fallback link (M2)
- `InstagramEmbed` — blockquote with `instagram-media` class + embed.js loader/process
- `TikTokEmbed` — blockquote with `tiktok-embed` class + cache-busted embed.js
- `SocialEmbedBlock` — main export, mounts after hydration, delegates to platform component

### 4. BlockRenderer wiring

**`src/components/blog/BlockRenderer.tsx`:**
- Added import + case for `social_embed`

### 5. Admin wiring

**`src/components/admin/blog/BlocksSection.tsx`:**
- Added `social_embed: "Social Embed"` to labels

**`src/components/admin/blog/BlockForm.tsx`:**
- State: `embedPlatform`, `embedUrl`, `showEmbedPreview`
- buildPayload case for `social_embed`
- Form UI: radio buttons for platform, URL input, "Preview Embed" button (M3)
- Preview only mounts on button click, resets when platform/URL changes

### 6. CSS

**`src/app/globals.css`:**
- `.social-embed-container` — centered flex container
- `.social-embed-fallback` — styled fallback link for error boundary

No fragile child selectors (M4) — max-width is applied inline in the embed blockquote elements.

---

## Files Changed

| File | Action |
|------|--------|
| `src/server/db/schema.ts` | Add enum value, update docblocks |
| `src/server/validators/blog.ts` | Add fields, union branch, superRefine, types |
| `src/types/blog.ts` | Add re-export |
| `src/components/blog/blocks/SocialEmbedBlock.tsx` | **NEW** — renderer |
| `src/components/blog/BlockRenderer.tsx` | Add case |
| `src/components/admin/blog/BlocksSection.tsx` | Add label |
| `src/components/admin/blog/BlockForm.tsx` | Add state, payload, form UI |
| `src/app/globals.css` | Add embed styles |
| `src/server/db/migrations/0006_add_social_embed_type.sql` | **NEW** — migration |
| `src/server/db/migrations/meta/_journal.json` | Add entry |

---

## Verification

1. `npx tsc --noEmit` — clean compile
2. Admin: "Add Social Embed" button appears in block type list
3. Admin: Select Instagram, paste a public post URL, click Preview → embed renders in form
4. Admin: Select TikTok, paste a public video URL, click Preview → embed renders in form
5. Admin: Submit → block saves to DB, renders on blog post page
6. Paste Instagram URL with TikTok selected → validator rejects with "URL must be a TikTok link"
7. Embed fails to load → error boundary shows styled fallback link
8. Navigate between blog posts → embeds re-initialize correctly

---

## Reviewer Feedback Addressed

| ID | Issue | Resolution |
|----|-------|-----------|
| H1 | Library pulls 6 unused transitive deps | DIY approach — zero npm dependencies |
| H2 | Adding to pgEnum without migration creates sync trap | Shipped migration (Option A) |
| M1 | No URL-platform cross-validation | superRefine checks hostname matches platform |
| M2 | No error boundary around third-party embeds | Class-based error boundary with fallback link |
| M3 | Live preview on every keystroke | "Preview" button — mount only when clicked |
| M4 | CSS child selector is fragile | max-width applied inline in JSX, no child selectors |
| L1 | Stale "instagram is deliberately omitted" docblock | Removed |
| L2 | Missing social_embed shape in schema docblock | Added |
