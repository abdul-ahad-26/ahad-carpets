import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"

const inter = Inter({ subsets: ["latin"] })

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
} 