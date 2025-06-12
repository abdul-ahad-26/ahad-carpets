import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-[#1a3fa6] hover:bg-[#2563eb]',
          footerActionLink: 'text-[#1a3fa6] hover:text-[#2563eb]',
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
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