"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserProfile } from "@/components/user-profile"
import { Navbar } from "@/components/navbar"

export default function ProfilePage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Profile</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your account and view your borrowings</p>
        </div>

        <UserProfile />
      </div>
    </main>
  )
}
