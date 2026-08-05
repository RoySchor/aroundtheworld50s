import type { Metadata } from "next";
import Image from "next/image";
import { STATIC_ASSETS } from "@/lib/cloudinary";
import { SITE_NAME } from "@/lib/constants";
import { getOgImageUrl } from "@/lib/seo";
import { ContactForm } from "@/components/about/ContactForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our journey exploring the world as a couple in our 50s — from family road trips to spontaneous city escapes.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: getOgImageUrl(STATIC_ASSETS.aboutMePageBg),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="page-container mt-28 lg:mt-44">
      <div className="about-me-section-container">
        <div className="about-me-top-section-container">
          <Image
            src={STATIC_ASSETS.aboutMePageBg}
            alt="About Me"
            width={800}
            height={600}
            className="about-me-image-container"
            priority
          />

          <div className="overlap-text-container-box">
            <h1 className="overlap-text-container-box-title">A Journey of Growth</h1>
            <p className="overlap-text-container-box-description">
              Our love for travel has evolved over the years, long before the age of smartphones. We
              remember those early days of planning trips with paper maps and Mapquest, meticulously
              plotting our routes. From those humble beginnings, we&apos;ve embraced the evolution
              of travel planning, incorporating GPS, travel apps, and even AI.
            </p>
          </div>
        </div>
      </div>

      <div className="about-me-section-container">
        <div className="about-me-bottom-section-container">
          <h2 className="about-me-bottom-section-container-title">What We&apos;re All About</h2>
          <p className="about-me-bottom-section-container-description">
            From family road trips with our children to spontaneous city escapes. Even when not
            traveling, we constantly explore and discover hidden gems in our NYC neighborhoods. We
            explore hidden corners every weekend, seeking unique experiences and off-the-beaten-path
            adventures. Believe me, there&apos;s always something new to discover in this vibrant
            city! You&apos;ll find us sharing our travel adventures alongside unique city
            experiences – the unexpected encounters, the hidden cafes, and the off-the-beaten-path
            discoveries that make travel truly special.
          </p>
          <p className="about-me-bottom-section-container-description">
            We&apos;re passionate about sharing our travel experiences with you, from epic family
            adventures like dog sledding in the Canadian wilderness and living on a houseboat for a
            couple of weeks to the simple joy of discovering a charming cafe on a quiet Manhattan
            street. Join us as we explore the world, one adventure at a time. I love to take photos,
            and I&apos;ll be sharing my photos and videos alongside our travel stories and city
            explorations right here on the blog and on my Instagram and TikTok. Follow along as we
            capture the essence of each journey through our lens.
          </p>
        </div>
      </div>

      <div className="about-me-section-container">
        <ContactForm />
      </div>
    </div>
  );
}
