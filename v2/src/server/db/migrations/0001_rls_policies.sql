-- Migration 0001: RLS policies
--
-- Defense-in-depth for the Supabase PostgREST API. The app itself
-- connects as `postgres` (BYPASSRLS) via Drizzle, so these policies
-- only affect the auto-generated REST API and Supabase client access.
--
-- With RLS ON and no policies (migration 0000's state), all non-superuser
-- access was denied by default. This migration opens up:
--   1. Public SELECT for published content (anon + authenticated)
--   2. Full CRUD for admins (authenticated + profiles.role = 'admin')
--   3. Self-read on profiles for any authenticated user
--
-- Apply via Supabase SQL Editor or psql — not via drizzle-kit migrate
-- (Drizzle doesn't manage RLS policies).

-- =====================================================================
-- Helper function: reusable admin check
-- =====================================================================
-- SECURITY DEFINER runs as the function owner (postgres), so it can
-- read profiles even when called from a context where the caller's
-- own profile policy hasn't been evaluated yet. STABLE tells the
-- planner it won't modify data. SET search_path = '' prevents
-- search_path hijacking.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =====================================================================
-- profiles
-- =====================================================================

-- Any authenticated user can read their own profile row
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Admins can insert/update/delete profiles
CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- blog_posts (parent table with status)
-- =====================================================================

-- Anyone (including anon) can read published posts
CREATE POLICY "blog_posts_select_published"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admins have full access (including drafts)
CREATE POLICY "blog_posts_admin_all"
  ON blog_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- blog_blocks (child of blog_posts)
-- =====================================================================

-- Anyone can read blocks belonging to published posts
CREATE POLICY "blog_blocks_select_published"
  ON blog_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_blocks.post_id
        AND blog_posts.status = 'published'
    )
  );

CREATE POLICY "blog_blocks_admin_all"
  ON blog_blocks FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- blog_itineraries (child of blog_posts)
-- =====================================================================

CREATE POLICY "blog_itineraries_select_published"
  ON blog_itineraries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_itineraries.post_id
        AND blog_posts.status = 'published'
    )
  );

CREATE POLICY "blog_itineraries_admin_all"
  ON blog_itineraries FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- blog_itinerary_items (grandchild: items → itineraries → posts)
-- =====================================================================

CREATE POLICY "blog_itinerary_items_select_published"
  ON blog_itinerary_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_itineraries
      JOIN blog_posts ON blog_posts.id = blog_itineraries.post_id
      WHERE blog_itineraries.id = blog_itinerary_items.itinerary_id
        AND blog_posts.status = 'published'
    )
  );

CREATE POLICY "blog_itinerary_items_admin_all"
  ON blog_itinerary_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- tips (parent table with status)
-- =====================================================================

CREATE POLICY "tips_select_published"
  ON tips FOR SELECT
  USING (status = 'published');

CREATE POLICY "tips_admin_all"
  ON tips FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- tip_sections (child of tips)
-- =====================================================================

CREATE POLICY "tip_sections_select_published"
  ON tip_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tips
      WHERE tips.id = tip_sections.tip_id
        AND tips.status = 'published'
    )
  );

CREATE POLICY "tip_sections_admin_all"
  ON tip_sections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- gallery_images (standalone — always publicly readable)
-- =====================================================================

-- Gallery has no status column; images are always shown on the home page
CREATE POLICY "gallery_images_select_public"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "gallery_images_admin_all"
  ON gallery_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
