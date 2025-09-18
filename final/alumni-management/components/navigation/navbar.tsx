"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, GraduationCap, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  // Debug: Log user state
  console.log('Navbar - User state:', user)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    // Redirect to home page after logout
    router.push('/')
  }

  const getDashboardLink = () => {
    if (!user) return "/auth/login"
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "alumni":
        return "/alumni/dashboard"
      case "student":
        return "/student/dashboard"
      default:
        return "/auth/login"
    }
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AlumniConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/directory" className="text-foreground hover:text-primary transition-colors">
              Alumni Directory
            </Link>
            <Link href="/events" className="text-foreground hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/jobs" className="text-foreground hover:text-primary transition-colors">
              Job Board
            </Link>
            <Link href="/news" className="text-foreground hover:text-primary transition-colors">
              News & Updates
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Join Now</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/directory"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Alumni Directory
            </Link>
            <Link
              href="/events"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/jobs"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Job Board
            </Link>
            <Link
              href="/news"
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              News & Updates
            </Link>

            {user ? (
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="px-2 py-1 text-sm font-medium text-gray-500">
                  Welcome, {user.name}
                </div>
                <Link
                  href={getDashboardLink()}
                  className="block text-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block text-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-red-600 hover:text-red-700 transition-colors text-left w-full px-2 py-1 rounded hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-border">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Join Now</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
