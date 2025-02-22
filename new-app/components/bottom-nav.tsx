"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileClock, Grid2X2, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 h-16 bg-gray-950 border-t border-gray-800">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center space-y-1",
            pathname === "/dashboard" ? "text-white" : "text-gray-400",
          )}
        >
          <FileClock size={24} />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link
          href="/feed"
          className={cn(
            "flex flex-col items-center space-y-1",
            pathname === "/feed" ? "text-white" : "text-gray-400",
          )}
        >
          <LayoutDashboard size={24} />
          <span className="text-xs">Feed</span>
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center space-y-1",
            pathname === "/profile" ? "text-white" : "text-gray-400",
          )}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}