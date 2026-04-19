# Mother's Feature Requests: Portrait Photos, Image Carousel, Stacked Images

Working plan for three features requested by mother. Each feature is a PR-sized chunk.

Last updated: 2026-04-19

---

## Design Decisions

**When to use `object-cover` vs `object-contain`:**
- **`object-cover`** — Decorative/background images where the visual context matters more than showing every pixel. The image fills its container and crops edges. Used for: blog card thumbnails, parallax hero backgrounds, world map hover previews, admin preview thumbnails.
- **`object-contain`** — Content images that mother chose specifically and wants displayed in full. The image shrinks to fit its container, preserving the entire photo. Used for: two-column block images, image carousel, stacked images.

**Image grid is the exception** — uses `object-cover` with a portrait-friendly aspect ratio (`3/4`) because grid uniformity requires all cells to be the same size. The taller ratio minimizes cropping of portraits without breaking the grid layout.

**Orphaned Cloudinary images:** When blocks containing images are deleted, the Cloudinary files remain. This is a pre-existing issue (affects `image_grid` today). It is not addressed in this plan — tracked as a separate follow-up. Not blocking for these features.

---

## Current State (baseline)

What works today:
- Blog content block system with 4 types: `text`, `two_column`, `image_grid`, `itinerary_with_map`
- Blocks stored in `blog_blocks` table with JSONB `data` column
- Zod discriminated union validates block shapes at API boundary
- `BlockRenderer` switch dispatches to per-type React components
- Images uploaded to Cloudinary as-is (no server-side cropping)
- All image containers use `object-cover` + fixed aspect ratios → crops portrait photos
- Home page `GallerySlider` shows 3 images at a time with auto-advance (from `gallery_images` table)
- Two-column block supports exactly 1 image per side

---

## Feature 1: Portrait Photo Support

*Goal: portrait photos display properly across the site instead of being cropped.*

### Problem

Every image location uses `object-cover` with fixed aspect ratios or heights:

| Context | Container | Cropping | Decision |
|---------|-----------|----------|----------|
| Image grid (blog block) | `aspect-ratio: 1` (square) | Heavy — portraits lose ~33% | **Fix:** Change to `3/4` |
| Two-column block | `min-height: 300px; max-height: 500px` | Heavy — portraits cropped to fill | **Fix:** Keep bounded height, switch to `object-contain` |
| Home page gallery slider | `h-52 sm:h-64` fixed height | Heavy — portraits cropped | **Fix:** Change to `object-contain` |
| Blog card thumbnails | `h-[200px] sm:h-[275px]` | Moderate | **Keep:** Decorative, uniform grid needed |
| Parallax hero | `h-screen bg-cover` | Full bleed | **Keep:** Background, landscape-only by design |
| World map hover | Fixed 112px | Minimal | **Keep:** Small decorative preview |
| Admin thumbnails | 48x48 | Minimal | **Keep:** UI element |

### Changes

#### 1.1 Image grid — taller aspect ratio

**Class:** `.image-grid-item` in `src/app/globals.css`

Change `aspect-ratio: 1` → `aspect-ratio: 3/4`.

Why `3/4` over alternatives:
- `aspect-ratio: auto` breaks grid uniformity (cells become different heights)
- `3/4` is portrait-friendly — a typical phone photo (3:4 or 9:16) loses minimal content
- Landscape images in a `3/4` cell lose a sliver at top/bottom edges — acceptable for grid thumbnails since the carousel (Feature 2) is the right place for full-display of individual photos
- `1:1` (current) loses ~33% of a portrait; `3/4` loses ~0% of a portrait and ~11% of a landscape

#### 1.2 Two-column image pane — bounded height with object-contain

> **Implementation note:** Since Features 1+3 ship as one PR, the final CSS uses `.single-image-container` from §3.5 rather than modifying the existing `.image-container` class. This section documents the target behavior and design rationale; §3.5 has the actual CSS to implement.

**Classes:** `.image-container` and `.image-container img` in `src/app/globals.css`

Current (problematic):
```css
.image-container {
  max-height: 500px;
  min-height: 300px;
}
.image-container img {
  object-cover;  /* crops to fill fixed height */
}
```

New approach — keep `<Image fill>`, keep bounded height, switch to `object-contain`:
```css
.image-container {
  @apply w-full relative overflow-hidden bg-gray-100 rounded-lg mx-auto;
  min-height: 200px;
  max-height: 500px;
}

.image-container img {
  @apply w-full h-full object-contain;
}
```

**Tradeoff acknowledged:** With `<Image fill>` (position: absolute on the img), the container height is driven by `min-height`/`max-height`, not by the image's natural aspect. This means:
- Portrait images: image shrinks to fit height, with gray bars on the sides (~20-30% of container width for typical 3:4 portraits in a landscape-biased container)
- Landscape images: image fills width, with minimal gray bars top/bottom
- The bars are bounded by the 200-500px height range and `bg-gray-100` keeps them subtle

This is the cleanest approach because: (a) `<Image fill>` is required since we don't know image dimensions at render time (Cloudinary public_ids don't encode dimensions), (b) `aspect-ratio: auto` on the container doesn't work with absolutely-positioned children (they don't participate in parent sizing), (c) the alternative (non-fill mode) would require storing image dimensions in the schema. The gray bars are a deliberate tradeoff — less ideal than auto-sizing, but far better than the current aggressive cropping that loses 30%+ of portrait photos.

#### 1.3 Home page gallery slider — object-contain

**Class:** `.gallery-image-box` in `src/app/globals.css`

The home page gallery (`GallerySlider`) uses the `gallery_images` table — this is a **separate system** from blog content blocks. It still crops portraits aggressively with `h-52 sm:h-64` + `object-cover`.

Change: Switch to `object-contain` and change the background to `bg-gray-100` for subtle letterboxing. The fixed height stays (needed for consistent slider layout) but images shrink-to-fit inside instead of crop-to-fill.

**File:** `src/components/gallery/GallerySlider.tsx` — change `className="object-cover"` to `className="object-contain"`

**File:** `src/app/globals.css` — `.gallery-image-box` change `bg-gray-200` to `bg-gray-100`

**Tradeoff acknowledged:** The slider shows 3 images side-by-side in a fixed-height row. With `object-contain`, each image sizes independently — if the row mixes one portrait and two landscapes, the landscape images will have thin bars top/bottom while the portrait fills height. The visual centers may be at slightly different vertical positions. This is acceptable because: (a) the full image is visible, which is mother's stated goal; (b) the `bg-gray-100` background makes bars subtle; (c) if mother finds it jarring, she can curate `gallery_images` to be same-orientation, or we can revisit with a per-image aspect container later.

#### 1.4 Mobile breakpoint updates

The existing mobile breakpoints for `.image-container` (at 768px and 640px) set fixed heights. Update them to work with the new bounded approach:

```css
@media (max-width: 768px) {
  .image-container {
    @apply w-full;
    min-height: 180px;
    max-height: 400px;
  }
}

@media (max-width: 640px) {
  .image-container {
    @apply w-4/5;
    min-height: 150px;
    max-height: 300px;
  }
}
```

Note: Feature 3 replaces `.image-container` with `.single-image-container` and `.stacked-images` for two-column blocks. Since Features 1+3 ship together, these mobile breakpoints will target the new class names in the final CSS.

### Files

| File | Change |
|------|--------|
| `src/app/globals.css` | `.image-grid-item` aspect `1` → `3/4`; `.image-container` auto height; `.gallery-image-box` bg color |
| `src/components/gallery/GallerySlider.tsx` | `object-cover` → `object-contain` |

---

## Feature 2: Image Carousel Content Block

*Goal: add a new blog block type that rotates through photos like a slideshow.*

### Design

New block type `image_carousel` — displays one image at a time with arrow navigation, counter display, and auto-advance. Uses `object-contain` so both orientations display fully.

Key differences from home page `GallerySlider`:
- Shows 1 image at a time (not 3)
- No title header
- Inline within blog post content flow
- Uses `object-contain` for portrait support
- Data comes from block JSONB (not `gallery_images` table)
- Supports captions per image

### 2.1 Database migration

```sql
ALTER TYPE blog_block_type ADD VALUE 'image_carousel';
```

### 2.2 Schema enum update

**File:** `src/server/db/schema.ts`

Add `"image_carousel"` to the `blogBlockType` pgEnum array.

### 2.3 Validator

**File:** `src/server/validators/blog.ts`

Add fields — using object array (not string array) to support captions:
```typescript
const imageCarouselBlockFields = {
  images: z.array(z.object({
    publicId: z.string().min(1),
    caption: z.string().optional(),
  })).min(2, "Carousel needs at least 2 images"),
};
```

No `autoAdvance` field — always auto-advances (matches GallerySlider). If mother specifically requests disabling it later, it's a trivial addition.

Add to discriminated union:
```typescript
z.object({ type: z.literal("image_carousel"), ...imageCarouselBlockFields }),
```

Export type `ImageCarouselBlockData`. Update `BlockType` union to include `"image_carousel"`.

### 2.4 Type re-export

**File:** `src/types/blog.ts`

Add `ImageCarouselBlockData` to the re-export list.

### 2.5 Renderer component

**New file:** `src/components/blog/blocks/ImageCarouselBlock.tsx`

Client component (`"use client"`) with:
- `useState(currentIndex)` — tracks which image is shown
- `useState(paused)` — tracks whether auto-advance is paused
- `useEffect` with `setInterval(5000)` for auto-advance, guarded by `!paused` (same interval as `GallerySlider`)
- `useCallback` for `nextSlide`/`prevSlide` (wraps around)
- Container: fixed height `h-64 sm:h-80 md:h-96` + `bg-gray-100` + `rounded-lg overflow-hidden`
- Image: `<Image fill className="object-contain" sizes="(max-width: 768px) 100vw, 900px" />`
- Nav arrows: circular buttons with `bg-black/40` positioned left/right
- Counter: `"3 / 12"` format (same as GallerySlider — scales to any count, unlike dots which overflow at 15+)
- Caption: displayed below the image when present, centered text
- Pause on hover/touch: `onMouseEnter` sets `paused=true`, `onMouseLeave` sets `paused=false`. On touch devices: `onTouchStart` sets `paused=true`, auto-advance resumes after slide change completes.
- Touch/swipe: basic swipe detection via `onTouchStart`/`onTouchEnd` tracking X delta (>50px threshold triggers prev/next). No external library needed for this simple case.

Why fixed height instead of `aspect-[4/3]`:
- `aspect-[4/3]` is landscape-biased — portrait images in a 4:3 viewport get ~50% pillarbox bars
- Fixed height (256-384px depending on breakpoint) with `object-contain` gives both orientations reasonable display
- Portrait images fill the height, landscape images fill the width — no excessive dead space either way
- Same approach the GallerySlider uses (`h-52 sm:h-64`)

### 2.6 BlockRenderer update

**File:** `src/components/blog/BlockRenderer.tsx`

Add import and case:
```typescript
case "image_carousel":
  return <ImageCarouselBlock data={block.data as ImageCarouselBlockData} />;
```

### 2.7 Admin form

**File:** `src/components/admin/blog/BlockForm.tsx`

Add `image_carousel` section — similar to image_grid but with caption inputs:
- State: `images` array of `{ publicId: string; caption?: string }`
- UI: image list with thumbnails, caption text input per image, move up/down, remove, plus `ImageUploadButton`
- `buildPayload` case returns `{ type: "image_carousel", images }`

### 2.8 Block section labels

**File:** `src/components/admin/blog/BlocksSection.tsx`

Add to `BLOCK_TYPE_LABELS`:
```typescript
image_carousel: "Image Carousel",
```

Add "Image Carousel" button to the add-block row.

### 2.9 CSS

**File:** `src/app/globals.css`

New section:
```css
/* Image carousel (blog image_carousel blocks) */
.image-carousel {
  @apply relative w-full my-8;
}

.image-carousel-viewport {
  @apply relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden;
}

.image-carousel-viewport img {
  @apply w-full h-full object-contain;
}

.image-carousel-nav {
  @apply absolute top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full
         flex items-center justify-center text-xl hover:bg-black/60 transition-colors cursor-pointer;
}

.image-carousel-counter {
  @apply text-center text-sm text-gray-500 mt-2;
}

.image-carousel-caption {
  @apply text-center text-sm text-gray-600 italic mt-1;
}
```

### Files

| File | Change |
|------|--------|
| `src/server/db/schema.ts` | Add `"image_carousel"` to pgEnum |
| `src/server/validators/blog.ts` | Add carousel fields (object array with caption), union branch, type export |
| `src/types/blog.ts` | Export `ImageCarouselBlockData` |
| `src/components/blog/blocks/ImageCarouselBlock.tsx` | **New** — carousel renderer with swipe support |
| `src/components/blog/BlockRenderer.tsx` | Add case |
| `src/components/admin/blog/BlockForm.tsx` | Add carousel form section with caption inputs |
| `src/components/admin/blog/BlocksSection.tsx` | Add label + button |
| `src/app/globals.css` | Carousel styles |
| Migration file | `ALTER TYPE blog_block_type ADD VALUE 'image_carousel'` |

---

## Feature 3: Multiple Stacked Images in Two-Column Blocks

*Goal: allow 2-3 images stacked vertically on one side of a two-column block.*

### Design: Clean Migration (Single Source of Truth)

Migrate existing `leftImage`/`rightImage` single fields to `leftImages`/`rightImages` arrays. This avoids permanent dual-field schema debt — one format, no priority logic, no legacy fallback code.

### 3.1 Data migration

Single migration file (runs as one transaction via Drizzle). Uses `jsonb_build_object` to reconstruct the JSONB from scratch — no old fields can survive:

```sql
UPDATE blog_blocks
SET data = jsonb_build_object(
  'leftType', data->>'leftType',
  'rightType', data->>'rightType',
  'html', data->>'html',
  'leftImages',
    CASE WHEN data->>'leftImage' IS NOT NULL AND data->>'leftImage' != ''
    THEN jsonb_build_array(jsonb_build_object(
      'publicId', data->>'leftImage',
      'alt', COALESCE(data->>'leftImageAlt', '')
    ))
    ELSE '[]'::jsonb END,
  'rightImages',
    CASE WHEN data->>'rightImage' IS NOT NULL AND data->>'rightImage' != ''
    THEN jsonb_build_array(jsonb_build_object(
      'publicId', data->>'rightImage',
      'alt', COALESCE(data->>'rightImageAlt', '')
    ))
    ELSE '[]'::jsonb END
)
WHERE type = 'two_column';
```

This rebuilds the entire JSON object with only the new fields. No two-step process, no partial state possible — if the migration fails mid-way the transaction rolls back and the old data is intact.

### 3.2 Validator replacement

**File:** `src/server/validators/blog.ts`

Replace old single-image fields with arrays:
```typescript
const twoColumnBlockFields = {
  leftType: z.enum(["image", "text"]),
  rightType: z.enum(["image", "text"]),
  leftImages: z.array(z.object({
    publicId: z.string().min(1),
    alt: z.string().optional(),
  })).optional(),
  rightImages: z.array(z.object({
    publicId: z.string().min(1),
    alt: z.string().optional(),
  })).optional(),
  html: z.string().min(1, "Two-column text content is required"),
};
```

Update `superRefine`:
- If side is "image": corresponding `Images` array must have length > 0
- Keep constraint: at least one side must be text, at least one must be image

Note on the "at least one side must be text" constraint: keeping this for now. Mother's request was "text on left with 3 stacked images on the right" — she always wants text paired with images. If she later wants image-only two-column (no text), the constraint is a one-line removal.

### 3.3 Renderer update

**File:** `src/components/blog/blocks/TwoColumnBlock.tsx`

Update `Pane` component — now only handles arrays (no single-image fallback needed post-migration). Uses two distinct code paths for single vs stacked to avoid ambiguous CSS specificity:

```tsx
function Pane({
  type,
  images,
  html,
}: {
  type: "image" | "text";
  images?: Array<{ publicId: string; alt?: string }>;
  html?: string;
}) {
  if (type === "image" && images?.length) {
    // Single image — full display with object-contain, no cropping
    if (images.length === 1) {
      return (
        <div className="content-pane-image">
          <div className="single-image-container">
            <Image
              src={images[0].publicId}
              alt={images[0].alt || "Blog image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      );
    }

    // Multiple images — stacked with object-cover for uniform sizing
    return (
      <div className="content-pane-image">
        <div className="stacked-images">
          {images.map((img, i) => (
            <div key={img.publicId} className="stacked-image-item">
              <Image
                src={img.publicId}
                alt={img.alt || `Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  // text pane unchanged
}
```

The `className` on each `<Image>` matches the CSS for its container — no conflicting specificity between JSX and stylesheet.

Update `TwoColumnBlock` to pass new props:
```tsx
<Pane type={data.leftType} images={data.leftImages} html={data.html} />
<Pane type={data.rightType} images={data.rightImages} html={data.html} />
```

Why `object-cover` (not `object-contain`) for stacked images:
- Stacked images in a column need visual consistency — each image should fill its cell uniformly
- Mixing `object-contain` with multiple images creates uneven sizing if orientations are mixed (one landscape fills width, one portrait fills height = jarring visual rhythm)
- `object-cover` with `aspect-[4/3]` gives each image a consistent shape in the stack
- For a single image (array length 1), we use the `.image-container` styles from Feature 1 which has the auto-height + `object-contain` treatment

### 3.4 Admin form update

**File:** `src/components/admin/blog/BlockForm.tsx`

Replace single image upload with multi-image list for each "image" side:
- State: `leftImages` / `rightImages` as `Array<{ publicId: string; alt?: string }>`
- UI per side: image list with preview thumbnail, alt text input, reorder arrows (up/down), remove button, "Add Image" upload button below
- On save: populate `leftImages`/`rightImages` in payload

### 3.5 CSS

**File:** `src/app/globals.css`

New section (replaces old `.image-container` used by two-column blocks):
```css
/* Single image in two-column — full display, no cropping */
.single-image-container {
  @apply w-full relative overflow-hidden bg-gray-100 rounded-lg mx-auto;
  min-height: 200px;
  max-height: 500px;
}

/* Stacked images (two-column blocks with multiple images) */
.stacked-images {
  @apply flex flex-col gap-3 w-full;
}

.stacked-image-item {
  @apply relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden;
}

/* Mobile breakpoints */
@media (max-width: 768px) {
  .single-image-container {
    min-height: 180px;
    max-height: 400px;
  }
}

@media (max-width: 640px) {
  .single-image-container {
    min-height: 150px;
    max-height: 300px;
  }
}
```

No `img` sub-selectors needed — the `<Image>` component's `className` prop handles `object-contain` (single) vs `object-cover` (stacked) directly in JSX, matching the code paths in §3.3.

Why `object-cover` + `aspect-[4/3]` for stacked items:
- Consistent sizing when stacking 2-3 images vertically
- Without a fixed aspect ratio, mixed-orientation images create an uneven column
- `4/3` slightly favors landscape but works well for both (portrait loses edges, landscape fills naturally)
- Single images get the full `object-contain` treatment (no cropping) via `.single-image-container`

### Files

| File | Change |
|------|--------|
| `src/server/validators/blog.ts` | Replace `leftImage`/`rightImage` with `leftImages`/`rightImages` arrays |
| `src/components/blog/blocks/TwoColumnBlock.tsx` | Render image arrays, single vs stacked styling |
| `src/components/admin/blog/BlockForm.tsx` | Multi-image upload UI for image sides |
| `src/app/globals.css` | `.stacked-images`, `.stacked-image-item`, `.single-image-container` |
| Migration file | Migrate existing JSONB data + remove old fields |

---

## Implementation Order

1. **Feature 1 + 3 as one PR** — they both touch `.image-container` / two-column rendering. Feature 1's CSS changes to `.image-container` would be partially obsoleted by Feature 3's rewrite, so shipping together avoids wasted diff.
2. **Feature 2** (Image carousel) — fully independent, own PR with DB enum migration.

---

## Verification

1. `npx tsc --noEmit` — clean compile after each feature
2. **Portrait photos (Feature 1):**
   - Upload portrait to image grid → displays in 3:4 container (minimal vertical crop)
   - Upload portrait to two-column block → displays fully, no excessive letterbox bars
   - Upload portrait to home page gallery → displays fully within fixed-height slider
   - Blog card thumbnails and parallax hero still use `object-cover` (unchanged)
3. **Image carousel (Feature 2):**
   - Create blog post → add "Image Carousel" block → upload 3+ images with captions
   - Arrows navigate between images, swipe left/right works on mobile
   - Auto-advance cycles every 5s, pauses on hover/touch
   - Counter shows "3 / 12" format (no dot overflow for large sets)
   - Captions display below image when provided
   - Portrait images display fully within fixed-height viewport
4. **Stacked images (Feature 3):**
   - Run data migration on dev DB → verify existing two-column blocks render identically
   - Edit two-column block → upload 2-3 images to the image side
   - Images stack vertically with consistent `4/3` aspect ratio per cell
   - Single-image two-column blocks use `object-contain` (full display, auto height)
   - Verify "at least one side must be text" constraint still enforced in admin form
5. `npm run dev` and verify all features visually across desktop and mobile viewports
