"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { BarChart3, LayoutDashboard, Package, Settings, ShoppingCart, Users, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cart } from "@/components/cart"

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

  return (
    <div className="flex items-center">
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
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
    </div>
  )
}

