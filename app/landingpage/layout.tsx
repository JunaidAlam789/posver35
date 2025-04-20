import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/context/cart-context"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </div>
  )
}
