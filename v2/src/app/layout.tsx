import type { Metadata } from "next";
import { Inter, Caveat, Scope_One, Grandstander } from "next/font/google";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getAdminProfileIfAuthenticated } from "@/server/auth";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat-var",
});

const scopeOne = Scope_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-scope-one-var",
});

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander-var",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminProfile = await getAdminProfileIfAuthenticated();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${scopeOne.variable} ${grandstander.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar isAdmin={!!adminProfile} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
