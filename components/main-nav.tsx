"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { BarChart3, LayoutDashboard, Package, Settings, ShoppingCart, Users, CreditCard, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cart } from "@/components/cart"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobileMenu } from "@/hooks/use-mobile-menu"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    color: "text-violet-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/products",
    color: "text-pink-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-orange-500",
  },
  {
    label: "Checkout",
    icon: CreditCard,
    href: "/checkout",
    color: "text-green-500",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-emerald-500",
  },
  {
    label: "Upload Image",
    icon: CreditCard,
    href: "/products/upload",
    color: "text-green-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isOpen, onOpen, onClose } = useMobileMenu()

  useEffect(() => {
    setIsMounted(true)
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center">
      {isMobile ? (
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={onOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="px-2 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-x-2 text-base font-medium transition-colors hover:text-primary p-2 rounded-md",
                      pathname === route.href ? "bg-muted text-black dark:text-white" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <div className="ml-4">
            <Cart />
          </div>
        </div>
      ) : (
        <>
          <nav className={cn("hidden lg:flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href ? "text-black dark:text-white" : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-x-2">
                  <route.icon className={cn("h-4 w-4", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </nav>
          <div className="ml-4">
            <Cart />
          </div>
        </>
      )}
    </div>
  )
}
