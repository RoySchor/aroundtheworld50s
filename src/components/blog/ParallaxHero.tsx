import { buildCloudinaryUrl } from "@/lib/cloudinary";

interface ParallaxHeroProps {
  imagePublicId: string;
  title: string;
}

export function ParallaxHero({ imagePublicId, title }: ParallaxHeroProps) {
  const bgUrl = buildCloudinaryUrl(imagePublicId, "w_1920");

  return (
    <div className="parallax-hero" style={{ backgroundImage: `url(${bgUrl})` }}>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="parallax-hero-title">{title}</h1>
      </div>
    </div>
  );
}
