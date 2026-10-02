import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Providers from "./providers";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConsultantLauncher from "@/components/consult/ConsultantLauncher";

const space = Space_Grotesk({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mobpie® — Websites People Remember",
  description:
    "Independent web engineer & designer from India crafting blazing-fast, mobile-first websites with motion and 3D. Live demos, fixed sprints, direct WhatsApp.",
  icons: { icon: "/images/favicon.png" },
  openGraph: {
    title: "Mobpie® — Websites People Remember",
    description: "Sub-second, mobile-first websites for brands that refuse to look ordinary. Live demos, fixed sprints, direct WhatsApp.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e4",
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mobpie — Bespoke Websites",
  description:
    "Independent web engineer & designer from India crafting blazing-fast, mobile-first websites with motion and 3D.",
  areaServed: "Worldwide",
  telephone: "+91-89574-20306",
  email: "mobpiexd@gmail.com",
  url: "https://mobpie-portfolio.vercel.app",
  sameAs: ["https://instagram.com/mobpie_dev"],
  founder: { "@type": "Person", name: "Mobpie", jobTitle: "Full-Stack Web Engineer & Designer" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${fraunces.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Providers>
          <Preloader />
          <Nav />
          <main>{children}</main>
          <Footer />
          <ConsultantLauncher />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
