import Image from "next/image";
import Flag from "react-world-flags";
import { getStateFlagSrc } from "@/lib/constants/us-states";

interface LocationFlagProps {
  countryCode: string;
  state?: string | null;
  alt: string;
  height?: string;
}

/** Country flag, or the state flag for US locations that have one. */
export function LocationFlag({ countryCode, state, alt, height }: LocationFlagProps) {
  const stateFlagSrc =
    countryCode.toUpperCase() === "US" && state ? getStateFlagSrc(state) : undefined;

  if (!stateFlagSrc) {
    return <Flag code={countryCode} alt={alt} height={height} />;
  }

  // `unoptimized` serves the local file as-is instead of routing it through the Cloudinary loader.
  return <Image src={stateFlagSrc} alt={alt} width={160} height={80} unoptimized />;
}
