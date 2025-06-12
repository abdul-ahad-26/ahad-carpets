import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity"
import { draftMode } from "next/headers"
import DisableDraftMode from "@/components/DisableDraftMode";

export const metadata: Metadata = {
  title: "Ahad Carpets - Premium Handcrafted Carpets",
  description: "Discover our exquisite collection of handcrafted carpets, rugs, and mats. Premium quality, traditional craftsmanship, and modern designs for your home.",
  keywords: "carpets, rugs, handcrafted, traditional carpets, modern rugs, home decor, floor coverings, premium carpets",
  authors: [{ name: "Ahad Carpets" }],
  creator: "Ahad Carpets",
  publisher: "Ahad Carpets",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahadcarpets.com",
    title: "Ahad Carpets - Premium Handcrafted Carpets",
    description: "Discover our exquisite collection of handcrafted carpets, rugs, and mats. Premium quality, traditional craftsmanship, and modern designs for your home.",
    siteName: "Ahad Carpets",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahad Carpets - Premium Handcrafted Carpets",
    description: "Discover our exquisite collection of handcrafted carpets, rugs, and mats. Premium quality, traditional craftsmanship, and modern designs for your home.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
export const viewport =  {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode/>
            <VisualEditing/>
          </>
        )}
        <main className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <WhatsAppButton />
        </main>
        <SanityLive />
      </body>
    </html>
  );
}
