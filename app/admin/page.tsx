"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Navbar } from "@/components/navbar"

const ADMIN_EMAILS = ["admin@library.com"]

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!ADMIN_EMAILS.includes(user.email)) {
      router.push("/")
    }
  }, [user, router])

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar title="📚 Library Admin" showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage books and view library statistics</p>
        </div>

        <AdminDashboard />
      </div>
    </main>
  )
}
