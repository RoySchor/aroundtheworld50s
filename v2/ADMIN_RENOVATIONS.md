# Admin Page Renovations

Working plan for admin UX improvements. Each phase is a PR-sized chunk of work.

Last updated: 2026-04-16

---

## Current State (baseline)

What works today:
- Blog + Tips + Gallery CRUD via admin panel
- Publish/unpublish/delete via status bar (sticky)
- Client-side preview modals (blog + tips) — preview unsaved changes without saving
- Rich text toolbar (Tiptap) — no raw HTML needed
- Plain-language labels, red asterisks, formatting help
- Back buttons with unsaved-changes warnings on all edit/create pages
- Auto-generated tip slugs (from country/state), auto-generated blog tipsSlug
- SEO description labels with helper text on tip forms
- Creating a post/tip defaults to **draft** (does not auto-publish) — this is correct
- User-friendly error messages for slug collisions
- Accessible preview modals (aria-modal, role="dialog")

---

## Phase 1: Navigation & Sticky Status Bar

*Goal: you can always get back, always see your actions, never lose work.*

### 1.1 Back button on all edit/create pages

Add a back link at the top of each page, above the title.

| Page | Back link target | Label |
|------|-----------------|-------|
| `/admin/blog/[id]` | `/admin/blog` | "Back to Blog Posts" |
| `/admin/blog/new` | `/admin/blog` | "Back to Blog Posts" |
| `/admin/tips/[id]` | `/admin/tips` | "Back to Tips" |
| `/admin/tips/new` | `/admin/tips` | "Back to Tips" |

Implementation: `<Link>` with a left arrow icon. Consistent styling across all four pages.

Files:
- `app/admin/blog/[id]/page.tsx`
- `app/admin/blog/new/page.tsx`
- `app/admin/tips/[id]/page.tsx`
- `app/admin/tips/new/page.tsx`

### 1.2 Sticky status bar

Make `PostStatusBar` and `TipStatusBar` stick to the top of the scrollable area as the user scrolls down through the edit form.

Implementation: wrap the status bar in a `sticky top-0 z-10` container with a subtle bottom shadow when scrolled. The admin layout's scroll container is the `<main>` area — sticky works within that.

Files:
- `app/admin/blog/[id]/page.tsx` — add sticky wrapper around `<PostStatusBar>`
- `app/admin/tips/[id]/page.tsx` — add sticky wrapper around `<TipStatusBar>`

### 1.3 Unsaved-changes warning

Track whether form fields have been modified from their initial values. If the user tries to navigate away (back button, sidebar link, browser back), show a confirmation dialog.

Implementation: `beforeunload` event for browser navigation + a custom hook `useUnsavedChanges(isDirty)` that sets the event listener. For in-app navigation (Next.js Link clicks), intercept via `useRouter` events or a wrapper component.

New file:
- `hooks/useUnsavedChanges.ts` — reusable hook

Modified files:
- `components/admin/blog/PostMetadataForm.tsx` — track dirty state
- `components/admin/tips/TipMetadataForm.tsx` — track dirty state
- `components/admin/tips/TipSectionsEditor.tsx` — track dirty state

Note: Block editing (BlockForm) already saves on submit and cancels on cancel, so dirty tracking is less critical there. Focus on the metadata forms and section editors where you can edit without an explicit save gesture.

---

## Phase 2: Rich Text Toolbar

*Goal: replace raw HTML textareas with a toolbar so the user never types HTML tags.*

### 2.1 Install Tiptap

Tiptap is the standard React rich text editor. It outputs HTML (which we already sanitize server-side), works with React 19, and has a modular extension system.

Packages:
```
@tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-underline @tiptap/pm
```

- `starter-kit` includes: bold, italic, headings, bullet list, ordered list, blockquote, code, hard break
- `extension-link` adds link insertion/editing
- `extension-underline` adds underline formatting

### 2.2 Create `RichTextEditor` component

New file: `components/admin/RichTextEditor.tsx`

A reusable client component that wraps Tiptap with a formatting toolbar.

**Toolbar buttons:**
| Button | Icon | Action | HTML output |
|--------|------|--------|-------------|
| **B** | Bold | Toggle bold | `<strong>` |
| *I* | Italic | Toggle italic | `<em>` |
| U | Underline | Toggle underline | `<u>` |
| H3 | Heading | Toggle heading level 3 | `<h3>` |
| List | Bullet list | Toggle bullet list | `<ul><li>` |
| 1. | Ordered list | Toggle ordered list | `<ol><li>` |
| Link | Link icon | Prompt for URL, wrap selection | `<a href>` |
| Quote | Blockquote | Toggle blockquote | `<blockquote>` |

**Props:**
```tsx
interface RichTextEditorProps {
  value: string;           // HTML string (initial content)
  onChange: (html: string) => void;  // called on every change
  rows?: number;           // approximate height hint
  placeholder?: string;
}
```

**Visual design:**
- Toolbar row at the top with icon buttons — active buttons show as "pressed" (darker background)
- Editor area below with comfortable padding, same font as current textareas
- Toolbar buttons are small, unobtrusive, grouped logically (text formatting | structure | insert)

**Two-tab view: Edit + Raw**
- Default tab: **Edit** — the Tiptap WYSIWYG editor where text appears formatted as you type (bold text looks bold, lists look like lists)
- Second tab: **Raw** — read-only view of the underlying HTML source, displayed in a `<pre>` block with monospace font
- Tabs sit below the toolbar, small and unobtrusive
- The edit tab IS the live preview — what you see is what the visitor sees. No need for a separate preview pane since the formatting renders inline.

### 2.3 Replace all HTML textareas with `RichTextEditor`

| File | Field(s) replaced |
|------|-------------------|
| `components/admin/blog/BlockForm.tsx` | `html` textarea (text blocks), `html` textarea (two-column blocks) |
| `components/admin/blog/PostMetadataForm.tsx` | `description` textarea |
| `components/admin/blog/CreatePostForm.tsx` | `description` textarea |
| `components/admin/tips/TipSectionsEditor.tsx` | section `content` textarea |
| `components/admin/tips/CreateTipForm.tsx` | `description` textarea |
| `components/admin/tips/TipMetadataForm.tsx` | `description` textarea (if present) |

Each replacement: swap `<textarea value={x} onChange={...} />` with `<RichTextEditor value={x} onChange={setX} />`.

### 2.4 Remove `HtmlHelperText`

Once the toolbar exists, the collapsible HTML tag reference is no longer needed — the toolbar IS the formatting interface. Remove `HtmlHelperText` and all its imports.

Files:
- Delete `components/admin/HtmlHelperText.tsx`
- Remove imports from: `BlockForm.tsx`, `PostMetadataForm.tsx`, `CreatePostForm.tsx`, `TipSectionsEditor.tsx`

### 2.5 Update `sanitize.ts` allowlist

Tiptap may output tags we don't currently allow. Audit and add if needed:
- `<u>` (underline) — currently NOT in allowlist, must add
- `<s>` or `<del>` (strikethrough) — add if we include that button
- All other starter-kit tags (`strong`, `em`, `ul`, `ol`, `li`, `h1`-`h6`, `blockquote`, `p`, `br`) are already allowed

---

## Phase 3: Create Post Flow

*Goal: creating a new post is a complete experience — not a metadata-only stub.*

### 3.1 Redirect to edit page after creation

This already works — `createBlogPost` redirects to `/admin/blog/[id]` on success. Confirmed: posts are created as **draft** by default. No change needed here.

### 3.2 Add guidance on create page

After the "Create Post" submit button, add a note:

> אחרי שתפרסמי, תעברי לעורך שם תוכלי להוסיף בלוקים של מידע, תמונות ותוכניות מסלול"

This sets expectations that creation is step 1, editing is step 2.

Files:
- `components/admin/blog/CreatePostForm.tsx` — add helper text below submit button
- `components/admin/tips/CreateTipForm.tsx` — same pattern

### 3.3 Back button integration (covered in Phase 1.1)

The back button on `/admin/blog/new` links to `/admin/blog`, and the unsaved-changes warning (Phase 1.3) protects against accidental navigation.

---

## Phase 4: Client-Side Preview + UX Polish

*Goal: true live preview (no save required), auto-generated slugs, clearer labels, dead code cleanup.*

### 4.1 Client-side preview modals (blog + tips)

Replaced the server-rendered preview routes (`/admin/blog/[id]/preview`, `/admin/tips/[id]/preview`) with client-side modals that render unsaved form state using the same presentational components as the public pages.

**Architecture:**
- Each edit page now has a **client wrapper** (`BlogEditClient`, `TipEditClient`) that collects state from child form components via `onStateChange` / `onDraftsChange` callbacks
- Preview modals (`BlogPreviewModal`, `TipPreviewModal`) render a full-screen overlay (z-200, body scroll lock, Escape to close) with the collected state
- Blog preview shows live metadata + saved blocks/itineraries (blocks save individually, so they're always current)
- Tips preview shows live metadata + section content drafts (unsaved edits appear in preview)
- Both modals have `role="dialog"`, `aria-modal="true"`, and `aria-label` for accessibility

**New files:**
- `components/admin/blog/BlogPreviewModal.tsx`
- `components/admin/blog/BlogEditClient.tsx`
- `components/admin/tips/TipPreviewModal.tsx`
- `components/admin/tips/TipEditClient.tsx`

**Modified files:**
- `PostMetadataForm` — exported `PostMetadataState` interface, added `onStateChange` callback
- `PostStatusBar` — preview `<Link>` → `<button onClick={onPreview}>`
- `TipMetadataForm` — exported `TipMetadataState` interface, added `onStateChange` callback
- `TipSectionsEditor` — added `onDraftsChange` callback
- `TipStatusBar` — preview `<Link>` → `<button onClick={onPreview}>`
- `app/admin/blog/[id]/page.tsx` — moved interactive components into `BlogEditClient`
- `app/admin/tips/[id]/page.tsx` — moved interactive components into `TipEditClient`

**Deleted files (dead preview routes):**
- `app/admin/blog/[id]/preview/layout.tsx`
- `app/admin/blog/[id]/preview/page.tsx`
- `app/admin/tips/[id]/preview/layout.tsx`
- `app/admin/tips/[id]/preview/page.tsx`

### 4.2 Auto-generated tip slugs

Removed manual URL Path editing from tip forms. Slugs are auto-generated and immutable after creation.

- **Create form:** slug computed at submit time — `slugify(country)` for non-US, `slugify(state)` for US tips. Read-only display shows the auto-generated path live as the user selects a country/state.
- **Edit form:** slug displayed as read-only text (`/tips/{slug}`), passed as `tip.slug` on save (never changes).
- **Slug collision handling:** `createTip` server action catches unique constraint violations and returns a user-friendly message: "A tips page for {country} already exists." (or state name for US tips).

### 4.3 Auto-generated blog tipsSlug

Removed manual "Tips Link Text" slug input from blog post forms. `tipsSlug` is auto-generated via `slugify(post.country)` — no user input needed.

### 4.4 SEO description label clarity

Tip description fields (create + edit) relabeled from "Description" to "Description (SEO)" with helper text: "Used for search engine meta tags only — not displayed on the page."

### 4.5 Label improvements

- "Tips Link Text" → `"View Tips" Button Text` (on blog create + edit forms) — clearer for non-technical users
- "Gallery" → "Home Gallery" in admin sidebar

### 4.6 Known gaps to revisit

- **Unsaved-changes: client-side navigation not intercepted.** `useUnsavedChanges` only covers `beforeunload` (browser back/refresh/tab close). Clicking sidebar links or back buttons while a form is dirty silently discards changes. Next.js App Router has no stable `routeChangeStart` event. Consider a lightweight interception wrapper if this causes real data loss.
- **Link insertion uses `window.prompt`.** Works but looks jarring — native browser dialog doesn't match admin UI. Consider a small inline popover for a more polished experience.
- **Blog preview doesn't track unsaved block edits.** Metadata is live-previewed, but blocks show saved DB state. Each block type has different data shapes, making draft tracking complex. Not worth it given blocks save individually — but it's a natural future request.
- **sanitize-html in client bundle.** `BlogPreviewModal` imports `sanitizeHtml` (~50KB) into the admin client bundle. Acceptable for admin-only pages; the public blog sanitizes server-side.

---

## File Inventory

| File | Phase | Action |
|------|-------|--------|
| `app/admin/blog/[id]/page.tsx` | 1.1, 1.2, 4.1 | Add back link, sticky status bar wrapper, use `BlogEditClient` |
| `app/admin/blog/new/page.tsx` | 1.1 | Add back link |
| `app/admin/tips/[id]/page.tsx` | 1.1, 1.2, 4.1 | Add back link, sticky status bar wrapper, use `TipEditClient` |
| `app/admin/tips/new/page.tsx` | 1.1 | Add back link |
| `components/admin/RichTextEditor.tsx` | 2.2 | **NEW** — Tiptap toolbar + editor + raw tab |
| `components/admin/blog/BlogEditClient.tsx` | 4.1 | **NEW** — client wrapper for blog edit (state collection + preview) |
| `components/admin/blog/BlogPreviewModal.tsx` | 4.1 | **NEW** — full-screen blog preview modal |
| `components/admin/blog/BlockForm.tsx` | 2.3 | Replace textareas with RichTextEditor |
| `components/admin/blog/PostMetadataForm.tsx` | 1.3, 2.3, 4.1, 4.3 | Dirty tracking, replace textarea, `onStateChange` callback, auto tipsSlug |
| `components/admin/blog/PostStatusBar.tsx` | 4.1 | Preview `<Link>` → `<button onClick={onPreview}>` |
| `components/admin/blog/CreatePostForm.tsx` | 2.3, 3.2, 4.3, 4.5 | Replace textarea, guidance text, auto tipsSlug, label improvements |
| `components/admin/tips/TipEditClient.tsx` | 4.1 | **NEW** — client wrapper for tip edit (state + draft collection + preview) |
| `components/admin/tips/TipPreviewModal.tsx` | 4.1 | **NEW** — full-screen tip preview modal |
| `components/admin/tips/TipSectionsEditor.tsx` | 1.3, 2.3, 4.1 | Dirty tracking, replace textarea, `onDraftsChange` callback |
| `components/admin/tips/TipMetadataForm.tsx` | 1.3, 2.3, 4.1, 4.2, 4.4 | Dirty tracking, replace textarea, `onStateChange`, read-only slug, SEO label |
| `components/admin/tips/TipStatusBar.tsx` | 4.1 | Preview `<Link>` → `<button onClick={onPreview}>` |
| `components/admin/tips/CreateTipForm.tsx` | 2.3, 3.2, 4.2, 4.4 | Replace textarea, guidance text, auto slug, SEO label |
| `components/admin/AdminSidebar.tsx` | 4.5 | "Gallery" → "Home Gallery" |
| `components/admin/HtmlHelperText.tsx` | 2.4 | **DELETE** |
| `hooks/useUnsavedChanges.ts` | 1.3 | **NEW** — reusable dirty-form hook |
| `lib/sanitize.ts` | 2.5 | Add `<u>` to allowlist |
| `server/actions/tips.ts` | 4.2 | User-friendly slug collision error messages |
| `package.json` | 2.1 | Add tiptap dependencies |
| `app/admin/blog/[id]/preview/*` | 4.1 | **DELETE** — dead route, replaced by client modal |
| `app/admin/tips/[id]/preview/*` | 4.1 | **DELETE** — dead route, replaced by client modal |

---

## Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Rich text editor | Tiptap | Standard React choice, outputs HTML (matches existing sanitize pipeline), modular, React 19 compatible, well-maintained |
| Toolbar scope | B, I, U, H3, bullet list, ordered list, link, blockquote | Matches the tags in `sanitize.ts` allowlist. No tables, no images (those have dedicated upload flows). Keeps it simple. |
| Live preview approach | WYSIWYG in-editor (what you type is what you see) + Raw tab | No separate preview pane needed — Tiptap renders formatting inline. Raw tab for power users who want to see/edit HTML directly. |
| Formatting help sidebar | Eliminated | The toolbar replaces it entirely. Toolbar IS the formatting interface. |
| Create post → add blocks | Keep two-step flow (create metadata, then edit blocks) | Simpler than a mega-form. The redirect already works. Just add guidance text. |
| Sticky element | Status bar only | Toolbar sticks within each RichTextEditor instance (Tiptap handles this). Status bar sticks globally. |

---

## Progress

| Phase | Status | PR/Commit |
|-------|--------|-----------|
| Phase 1: Navigation & Sticky Status Bar | Done | admin-nav-and-login-redesign |
| Phase 2: Rich Text Toolbar | Done | admin-nav-and-login-redesign |
| Phase 3: Create Post Flow | Done | admin-nav-and-login-redesign |
| Phase 4: Client-Side Preview + UX Polish | Done | fixing-preview (PR #22) |
| Round 2: Off-white bg, blockquote fix, image grid UX, itinerary cascade | Done | admin-nav-and-login-redesign |
