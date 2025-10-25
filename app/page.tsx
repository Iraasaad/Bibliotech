"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

const ADMIN_EMAILS = ["admin@library.com"]

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome to Library</h2>
          <p className="text-muted-foreground">Manage your books and borrowings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/catalog">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-foreground mb-2">Books Catalog</h2>
              <p className="text-muted-foreground text-sm">Browse and search our collection</p>
            </div>
          </Link>
          <Link href="/profile">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-foreground mb-2">My Borrowings</h2>
              <p className="text-muted-foreground text-sm">View your borrowed books</p>
            </div>
          </Link>
          <Link href="/profile">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-foreground mb-2">Profile</h2>
              <p className="text-muted-foreground text-sm">Manage your account</p>
            </div>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full sm:col-span-2 lg:col-span-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">Admin Dashboard</h2>
                <p className="text-muted-foreground text-sm">Manage library and view statistics</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
