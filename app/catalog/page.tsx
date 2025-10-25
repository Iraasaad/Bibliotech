"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BooksCatalog } from "@/components/books-catalog"
import { Navbar } from "@/components/navbar"

export default function CatalogPage() {
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar title="📚 Library" showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Books Catalog</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Browse and search our collection of books</p>
        </div>

        <BooksCatalog />
      </div>
    </main>
  )
}
