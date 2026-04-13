import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/server/repositories/blog";
import { getGalleryImages } from "@/server/repositories/gallery";
import { buildCloudinaryUrl, STATIC_ASSETS } from "@/lib/cloudinary";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { GallerySlider } from "@/components/gallery/GallerySlider";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const instagramUrl =
  SOCIAL_LINKS.find((l) => l.platform === "instagram")?.url ??
  "https://www.instagram.com/aroundtheworld50s/";

export default async function HomePage() {
  const [posts, galleryImages] = await Promise.all([
    getPublishedPosts(),
    getGalleryImages(),
  ]);
  const recentPosts = posts.slice(0, 4);
  const heroUrl = buildCloudinaryUrl(STATIC_ASSETS.homePageBg, "w_1920");

  return (
    <div className="page-container">
      {/* Hero */}
      <div
        className="parallax-hero"
        style={{ backgroundImage: `url(${heroUrl})` }}
      >
        <div className="relative z-10 text-center text-white px-4">
          <p className="parallax-hero-title mt-32 sm:mt-40 md:mt-48 lg:mt-56">
            EXPLORE WITH EMOTION.
            <br />
            <br />
            LIVE FOR THE JOURNEY.
          </p>
          <Link
            href="/about"
            className="home-page-hero-button inline-block text-white no-underline"
          >
            WHO AM I?
          </Link>
        </div>
      </div>

      {/* Travel With Us */}
      <div className="home-page-section-container">
        <h2 className="home-page-section-title">Travel With Us!</h2>
        <p className="home-page-section-description">
          As a couple in our 50s, we&apos;ve embarked on countless adventures as
          a duo and sometimes with our grown sons. We&apos;ve had the privilege
          of exploring many destinations. We&apos;re passionate about sharing our
          experiences through detailed itineraries, honest tips and reviews, and
          breathtaking photography. Whether you&apos;re a seasoned traveler or a
          first-time explorer, we&apos;re here to inspire and guide you on your
          next adventure.
        </p>
        <p className="home-page-section-description">
          Join us as we uncover hidden gems, immerse ourselves in diverse
          cultures, and savor the world&apos;s beauty. Planning a trip can be
          overwhelming. Scrolling through countless reviews and videos can leave
          you feeling lost and trying to figure out where to start. Let us
          leverage our experience to help you plan a seamless and unforgettable
          trip. You can minimize stress and maximize enjoyment with our insider
          tips and expert advice.
        </p>
      </div>

      {/* Most Recent Posts */}
      <div className="recent-posts-container">
        <h2 className="recent-posts-title">The Latest from the Blog</h2>
        <div className="py-8">
          <BlogGrid posts={recentPosts} columns={4} />
        </div>
      </div>

      {/* Gallery */}
      <GallerySlider
        images={galleryImages.map((img) => ({
          cloudinaryPublicId: img.cloudinaryPublicId,
          caption: img.caption,
        }))}
      />

      {/* Instagram Fallback */}
      <div className="instagram-fallback">
        <div className="instagram-fallback-card">
          <h2 className="instagram-fallback-title">
            Join me on Instagram{" "}
            <span className="text-teal-accent">@aroundtheworld50s</span>
          </h2>
          <p>Follow us on Instagram to see our latest updates!</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-fallback-link"
          >
            Visit our Instagram Profile
          </a>
        </div>
      </div>
    </div>
  );
}
