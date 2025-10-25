"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const ADMIN_EMAILS = ["admin@library.com"]

interface NavbarProps {
  title?: string
  showBackButton?: boolean
}

export function Navbar({ title = "📚 Library", showBackButton = false }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  const handleLogout = () => {
    logout()
    router.push("/login")
    setMobileMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="mr-2">
                ←
              </Button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <Link href="/catalog">
                  <Button variant="ghost" size="sm">
                    Catalog
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">{user.name}</div>
                  <button
                    onClick={() => handleNavigation("/catalog")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                  >
                    Books Catalog
                  </button>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                  >
                    My Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleNavigation("/admin")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors border-t border-border mt-2 pt-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
