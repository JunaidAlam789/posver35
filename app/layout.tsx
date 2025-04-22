import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { initDatabase } from "@/lib/db/init"
import { CartProvider } from "@/lib/context/cart-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// Initialize database
initDatabase().catch(console.error)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>{children}</CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  generator: "v0.dev",
}
