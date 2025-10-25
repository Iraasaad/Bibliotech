"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const DEMO_ACCOUNTS = [
  { email: "user@example.com", password: "password123", name: "John Doe" },
  { email: "admin@example.com", password: "admin123", name: "Admin User" },
  { email: "member@example.com", password: "member123", name: "Jane Smith" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const account = DEMO_ACCOUNTS.find((acc) => acc.email === email && acc.password === password)

      if (!account) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      login(account)
      router.push("/")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const fillDemoAccount = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your library account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemoAccount(account)}
                  className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-sm text-foreground">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                </button>
              ))}
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
