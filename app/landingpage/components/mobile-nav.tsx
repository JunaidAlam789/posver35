"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-xl font-bold">ShopEase</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-4 py-4">
          <Link
            href="#products"
            className="text-lg font-medium hover:underline underline-offset-4"
            onClick={() => setOpen(false)}
          >
            Products
          </Link>
          <Link
            href="#categories"
            className="text-lg font-medium hover:underline underline-offset-4"
            onClick={() => setOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="#about"
            className="text-lg font-medium hover:underline underline-offset-4"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            href="#testimonials"
            className="text-lg font-medium hover:underline underline-offset-4"
            onClick={() => setOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="/dashboard"
            className="text-lg font-medium hover:underline underline-offset-4"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
        </nav>
        <div className="mt-auto border-t pt-4 flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              Sign In
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Shop Now
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

