"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileClock, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 h-16 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-white text-xl font-bold">Kyrexx</div>
        <div className="flex space-x-8">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center space-x-2 hover:text-white transition-colors",
              pathname === "/dashboard" ? "text-white" : "text-gray-400"
            )}
          >
            <FileClock size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/feed"
            className={cn(
              "flex items-center space-x-2 hover:text-white transition-colors",
              pathname === "/feed" ? "text-white" : "text-gray-400"
            )}
          >
            <LayoutDashboard size={20} />
            <span>Feed</span>
          </Link>
          <Link
            href="/profile"
            className={cn(
              "flex items-center space-x-2 hover:text-white transition-colors",
              pathname === "/profile" ? "text-white" : "text-gray-400"
            )}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
