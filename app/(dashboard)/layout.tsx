import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <MainNav className="mx-0 md:mx-6" />
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">{children}</div>
    </div>
  )
}
