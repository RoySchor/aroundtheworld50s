# Cascading Blog Deletion: Post Re-indexing + Auto-unpublish Tips

## Context

Blog post URLs are index-based: `/blog/new-york/1`, `/blog/new-york/2`. Currently, deleting a post leaves gaps in the index sequence (delete post 2 of 3 → posts 1,3 remain). `getNextPostIndex` uses `MAX+1`, so creating a new post after deletion skips numbers. Additionally, deleting ALL posts for a country/state has no effect on the associated tips page — it stays published even though no blog content backs it.

**Goal:** Make `postIndex` contiguous (gap-closing on delete) and auto-unpublish the matching tips page when the last **published** blog post for a country/state is removed. The destinations page (map flags, dropdown) already handles this correctly since it's 100% DB-driven.

**Key data model nuance — US states:** All US blog posts share `countrySlug = "united-states"` (derived from `slugify("United States")`), but they have distinct `state` values ("Massachusetts", "New York", etc.). Tips for US states use `slug = slugify(state)` (e.g., `"massachusetts"`), NOT `slugify(country)`. This means the remaining-count query and tip-matching query must be **state-aware** for US posts, otherwise deleting the last Massachusetts blog would silently fail to unpublish the Massachusetts tip.

---

## 1. Database Migration — Make `(countrySlug, postIndex)` Deferrable

**New file:** `src/server/db/migrations/0002_deferrable_post_index.sql`

```sql
ALTER TABLE "blog_posts"
  DROP CONSTRAINT "blog_posts_country_slug_post_index_unique";
--> statement-breakpoint
ALTER TABLE "blog_posts"
  ADD CONSTRAINT "blog_posts_country_slug_post_index_unique"
  UNIQUE ("country_slug", "post_index")
  DEFERRABLE INITIALLY DEFERRED;
```

Follows the exact DROP+ADD pattern from lines 188-206 of `0000_initial_schema.sql`. Uses `INITIALLY DEFERRED` to match all other position-based constraints in this project (blog_blocks, blog_itineraries, tip_sections, gallery_images). No `SET CONSTRAINTS` call needed in app code.

**Also update:** `src/server/db/migrations/meta/_journal.json` — add entry for idx 1 (not 2, because 0001_rls_policies was applied outside Drizzle Kit and has no journal entry), tag `0002_deferrable_post_index`.

---

## 2. Update Schema Comments

**File:** `src/server/db/schema.ts`

**Lines 48-51** — header comment currently says `NOT applied to blog_posts(country_slug, post_index) because post_index is a stable identifier, not a reorderable slot`. Update to note it IS now deferrable (migration 0002), and post_index is re-indexed on delete to stay contiguous.

**Lines 146-149** — blogPosts docstring currently says `indexes are stable integers within a country, no renumbering`. Update to say indexes are contiguous, renumbered on delete to close gaps. Clarify no dangling FKs because blog_blocks/blog_itineraries reference `id`, not `postIndex`.

---

## 3. Fix `getNextPostIndex` — COUNT instead of MAX

**File:** `src/server/repositories/admin-blog.ts` (lines 34-44)

Change `COALESCE(MAX(post_index), 0)` to `COUNT(*)`. With contiguous re-indexing, the next index is always `existing_count + 1`. This is inherently gap-proof and handles the "all deleted then recreate" case (returns 1).

```typescript
export async function getNextPostIndex(countrySlug: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.countrySlug, countrySlug));
  return (result[0]?.count ?? 0) + 1;
}
```

**Note:** `getNextPostIndex` stays scoped to `countrySlug` (not state-aware) because `postIndex` is unique within `(countrySlug, postIndex)` — the index space is per countrySlug across all states. This is correct.

---

## 4. Rewrite `deleteBlogPost` — Transaction + Re-index + Auto-unpublish

**File:** `src/server/actions/blog-posts.ts` (lines 142-160)

This is the core change. Follows the established `deleteBlogBlock` pattern (blog-blocks.ts:85-108).

**New imports needed:**
- Add `and`, `gt`, `sql`, `isNull` to existing `eq` import from `drizzle-orm`
- Add `tips` to existing `blogPosts` import from schema
- Add `revalidatePublicTipPaths` from `./helpers`
- `slugify` is already imported (line 12)

**New logic:**

```
1. Transaction:
   a. DELETE the target post → get { countrySlug, postIndex, state }
      (added `state` to RETURNING — needed for state-aware tip matching)
   b. If not found, return error
   c. UPDATE blogPosts SET postIndex = postIndex - 1
      WHERE countrySlug = deleted.countrySlug AND postIndex > deleted.postIndex
      (re-indexes ALL posts in the countrySlug, across all states — correct
       because postIndex is scoped to countrySlug, not state)
      (constraint is INITIALLY DEFERRED — no conflicts)

2. After transaction — count remaining PUBLISHED posts FOR THIS STATE/COUNTRY:
   - If deleted.state is NOT NULL (US state post):
       WHERE countrySlug = ? AND state = deleted.state AND status = 'published'
   - If deleted.state IS NULL (non-US, or US country-level):
       WHERE countrySlug = ? AND state IS NULL AND status = 'published'

   WHY published-only: The tip should unpublish when there's no public blog
   content backing it. Draft posts are in-progress work — they don't appear
   on the destinations page or in public listings. Keeping the tip published
   when only drafts remain creates a disconnect: the destinations page shows
   no flag for that country, but the tip is still accessible. Published-only
   keeps the public experience consistent.

   WHY state-aware: All US posts share countrySlug = "united-states".
   Counting by countrySlug alone would include ALL US state posts.
   Deleting the last Massachusetts blog wouldn't trigger unpublish
   because New York posts still exist under the same countrySlug.

3. If remainingPublishedCount === 0 — auto-unpublish matching tip:
   Derive the tip slug: deleted.state ? slugify(deleted.state) : deleted.countrySlug

   WHY: Tips for US states use slug = slugify(state) (e.g., "massachusetts"),
   not slugify(country) ("united-states"). For non-US countries, both derive
   from country name so they match. (See CreateTipForm.tsx:38)

   UPDATE tips SET status = 'draft', publishedAt = NULL
   WHERE slug = derivedTipSlug AND status = 'published'
   RETURNING slug
   → If a row was updated, call revalidatePublicTipPaths(slug)

4. Revalidate all affected blog paths (new helper below)

5. redirect("/admin/blog")
   IMPORTANT: Must be OUTSIDE the transaction. redirect() throws NEXT_REDIRECT;
   if called inside db.transaction(), the throw would roll back the transaction.
   Matches the deleteBlogBlock pattern (blog-blocks.ts:85-114).
```

**New revalidation helper** (add to blog-posts.ts, keep existing `revalidatePublicPaths` for other actions):

```typescript
function revalidateAfterDelete(
  countrySlug: string,
  deletedPostIndex: number,
  totalRemainingInSlug: number,
) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${countrySlug}`);
  // Revalidate from deleted index through old last index
  for (let i = deletedPostIndex; i <= totalRemainingInSlug + 1; i++) {
    revalidatePath(`/blog/${countrySlug}/${i}`);
  }
}
```

Rationale for the loop: deleting post 2 of 4 → remaining 1,2,3. Must revalidate indexes 2 (now different content), 3 (now different content), and 4 (now 404).

**Note — two separate counts needed after the transaction:**
1. **Published + state-aware count** (for tip unpublish decision) — `WHERE countrySlug = ? AND state = ?/IS NULL AND status = 'published'`
2. **All-status + countrySlug-only count** (for revalidation loop bound) — `WHERE countrySlug = ?`

These differ for US states and when drafts exist. The revalidation loop needs the total count because postIndex is scoped to countrySlug across all states and statuses.

---

## 5. Update `unpublishBlogPost` — Shared Auto-unpublish Helper

**File:** `src/server/actions/blog-posts.ts`

The underlying requirement is "auto-unpublish tip when no published blog content backs it" — and unpublishing the last published post creates the same state as deleting it. Without this, the scenario is:

1. Spain has 2 published blog posts + 1 published tip
2. Delete post 1 → 1 published post remains → tip stays published
3. Unpublish post 2 → 0 published posts remain → tip stays published (bug)

The destinations page now shows no Spain flag (it only reads published posts), but `/tips/spain` is still live.

**Fix:** Extract the state-aware count + tip unpublish logic into a shared helper `autoUnpublishTipIfEmpty(countrySlug, state)`, called from both `deleteBlogPost` and `unpublishBlogPost`.

```typescript
async function autoUnpublishTipIfEmpty(
  countrySlug: string,
  state: string | null,
) {
  const stateFilter = state
    ? eq(blogPosts.state, state)
    : isNull(blogPosts.state);

  const [remaining] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.countrySlug, countrySlug),
        stateFilter,
        eq(blogPosts.status, "published"),
      ),
    );

  if (Number(remaining?.count ?? 0) === 0) {
    const tipSlug = state ? slugify(state) : countrySlug;

    const [tip] = await db
      .update(tips)
      .set({ status: "draft", publishedAt: null })
      .where(and(eq(tips.slug, tipSlug), eq(tips.status, "published")))
      .returning({ slug: tips.slug });

    if (tip) {
      revalidatePublicTipPaths(tip.slug);
    }
  }
}
```

**Changes to `unpublishBlogPost`:**
- Add `state: blogPosts.state` to the RETURNING clause
- Call `await autoUnpublishTipIfEmpty(post.countrySlug, post.state)` after the UPDATE

**Safety note:** `autoUnpublishTipIfEmpty` is called outside the transaction in both paths. In `unpublishBlogPost`, the single-statement UPDATE auto-commits before the count query runs, so the now-draft post is correctly excluded from the published count.

---

## Files Summary

| File | Change |
|---|---|
| `src/server/db/migrations/0002_deferrable_post_index.sql` | **New** — make constraint deferrable |
| `src/server/db/migrations/meta/_journal.json` | Add migration entry (idx 1) |
| `src/server/db/schema.ts` | Update 2 comments (lines 48-51, 146-149) |
| `src/server/repositories/admin-blog.ts` | `getNextPostIndex`: MAX → COUNT |
| `src/server/actions/blog-posts.ts` | Rewrite `deleteBlogPost` + add `revalidateAfterDelete` + add `autoUnpublishTipIfEmpty` shared helper + update `unpublishBlogPost` to trigger tip auto-unpublish |

---

## What We Don't Need to Change

- **Destinations page** — already 100% DB-driven (derives countries from `getPublishedPosts()`). Removing all published posts for a country automatically removes the flag and dropdown entry.
- **Blog creation** — `getNextPostIndex` with COUNT+1 handles everything correctly.
- **Blog update** — `updateBlogPost` cannot change postIndex or countrySlug, no changes needed.
- **Tips deletion** — remains independent; this feature only auto-*unpublishes*, never deletes tips.
- **`publishBlogPost`** — deliberately does NOT auto-re-publish tips. If the last published post is unpublished (tip auto-unpublishes) and then re-published, the tip stays draft. Auto-re-publishing would be surprising since the admin may have unpublished the tip intentionally. The admin handles tip re-publishing manually.
- **Sitemap** — `src/app/sitemap.ts` uses `dynamic = "force-dynamic"` and queries `getPublishedPosts()` + `getPublishedTips()`. Automatically correct after changes — no revalidation needed.
- **Admin blog list** — parent layout (`src/app/admin/layout.tsx:5`) sets `dynamic = "force-dynamic"`. The redirect to `/admin/blog` triggers a fresh DB query showing updated indexes. No stale data risk.

---

## Known Tradeoffs & Pre-existing Issues

1. **SEO impact of URL changes:** When post 2 of 3 is deleted and post 3 becomes post 2, `/blog/spain/2` shows completely different content and `/blog/spain/3` returns 404. Google has indexed both URLs with specific content. For a personal travel blog this is acceptable. If SEO matters more later, options include a redirect mapping table (old index → new index) or switching to slug-based URLs entirely.

2. **Cloudinary folder path drift:** `PostMetadataForm.tsx:216` uses `folder=aroundtheworld50s/blog/${post.countrySlug}/${post.postIndex}`. After re-indexing, a post's postIndex changes but previously uploaded images remain in the old Cloudinary folder. Not a functional bug — Cloudinary URLs use the full `public_id`, so images still render. But a single post's images may be scattered across folders. Could switch to UUID-based folder paths as a separate cleanup.

3. **`revalidatePath("/destinations")` is a no-op:** `destinations/page.tsx` uses `dynamic = "force-dynamic"`, so it's never cached. Omitting from `revalidateAfterDelete` for correctness (no false sense of coverage).

4. **Race condition on concurrent blog creation (pre-existing):** Two simultaneous `createBlogPost` calls for the same countrySlug will both call `getNextPostIndex`, get the same count, and try to insert with the same postIndex. The unique constraint catches it — one fails. This exists today with `MAX+1` and `COUNT+1` doesn't worsen it. Non-issue for a single-admin blog.

5. **TipsCta broken link after tip unpublish:** `TipsCta` (`src/components/blog/TipsCta.tsx:12`) renders an unconditional `<Link href="/tips/{tipsSlug}">`. When a tip is auto-unpublished, published blog posts that reference it via `tipsSlug` will link to a 404. The tip detail page (`getTipBySlug`) correctly returns `notFound()` for draft tips, so it's not a security issue — just a poor UX. This exists today if someone manually unpublishes a tip. **Consider a follow-up to either server-resolve the tip before rendering or hide the CTA.**

6. **Blog `tipsSlug` mismatch for US states:** `CreatePostForm.tsx:55` sets `tipsSlug: slugify(country)` for ALL posts, including US states. For a Massachusetts post, `tipsSlug = "united-states"`, but the Massachusetts tip has `slug = "massachusetts"`. This means the CTA link on US state blog posts already points to the wrong tip. **Separate bug — not introduced by this feature.**

---

## Verification

1. **Type check:** `npx tsc --noEmit` — clean compile
2. **Migration:** Run `npm run db:migrate`, verify constraint is `DEFERRABLE INITIALLY DEFERRED` in psql
3. **Re-index test:** Create posts 1,2,3 for a country → delete post 2 → verify remaining are indexed 1,2 (not 1,3)
4. **Next index test:** After above, create new post → verify it gets index 3 (not 4)
5. **Full delete + recreate:** Delete all posts for a country → create new one → verify index is 1
6. **First/last delete:** Delete post 1 (all others decrement) and post 3 of 3 (no re-indexing needed)
7. **URL correctness:** After re-indexing, `/blog/{slug}/2` shows the post formerly at index 3
8. **Tips auto-unpublish (non-US):** Create published tip for "spain" + 2 blog posts → delete one → tip stays published → delete last → tip becomes draft, `/tips/spain` 404s
9. **Tips auto-unpublish (US state):** Create published tip for "massachusetts" + 2 Massachusetts blog posts → delete one → tip stays published → delete last Massachusetts post (New York posts may still exist) → Massachusetts tip becomes draft, `/tips/massachusetts` 404s → New York tip unaffected
10. **Edge: no matching tip:** Delete last post for a country with no tip page → no error
11. **Edge: tip already draft:** Delete last post when tip is already draft → no error, no double-draft
12. **Edge: US mixed states:** Have posts for both Massachusetts and New York under "united-states" → delete all Massachusetts posts → only Massachusetts tip unpublished, New York tip stays published
13. **Draft-post re-indexing:** Create posts 1 (published), 2 (draft), 3 (published) → delete post 1 → verify indexes are now 1 (was-draft), 2 (was-published). Verify `/blog/{slug}/1` returns 404 (draft post, not publicly accessible), `/blog/{slug}/2` shows the published post.
14. **Published-only tip trigger:** Spain has 2 published + 1 draft blog → delete both published → tip unpublishes (only drafts remain, no public content backing the tip)
15. **US state cross-state re-indexing:** Massachusetts post at index 1, New York post at index 2 (both under "united-states") → delete Massachusetts (index 1) → New York becomes index 1 → New York tip unaffected → Massachusetts tip unpublishes only if no other Massachusetts posts remain
16. **Tips auto-unpublish via unpublish (non-US):** Spain has 2 published posts + 1 published tip → unpublish post 1 → tip stays published → unpublish post 2 → 0 published posts remain → tip becomes draft, `/tips/spain` 404s
17. **Tips auto-unpublish via unpublish (US state):** Massachusetts has 2 published posts + 1 published tip, New York also has posts → unpublish both Massachusetts posts → Massachusetts tip becomes draft → New York tip unaffected
18. **Unpublish with other published posts remaining:** Spain has 3 published posts → unpublish one → 2 remain → tip stays published
