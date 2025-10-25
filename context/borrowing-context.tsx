"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import type { Borrowing } from "@/lib/borrowing-data"

interface BorrowingContextType {
  borrowings: Borrowing[]
  borrowBook: (bookId: string) => void
  returnBook: (borrowingId: string) => void
  getUserBorrowings: (userId: string) => Borrowing[]
}

const BorrowingContext = createContext<BorrowingContextType | undefined>(undefined)

export function BorrowingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])

  // Load borrowings from localStorage on mount
  useEffect(() => {
    const storedBorrowings = localStorage.getItem("borrowings")
    if (storedBorrowings) {
      try {
        setBorrowings(JSON.parse(storedBorrowings))
      } catch (err) {
        console.error("Failed to parse stored borrowings:", err)
      }
    }
  }, [])

  const borrowBook = (bookId: string) => {
    if (!user) return

    const borrowDate = new Date().toISOString()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const newBorrowing: Borrowing = {
      id: `borrow-${Date.now()}`,
      userId: user.email,
      bookId,
      borrowDate,
      dueDate: dueDate.toISOString(),
      status: "active",
    }

    const updatedBorrowings = [...borrowings, newBorrowing]
    setBorrowings(updatedBorrowings)
    localStorage.setItem("borrowings", JSON.stringify(updatedBorrowings))
  }

  const returnBook = (borrowingId: string) => {
    const updatedBorrowings = borrowings.map((b) =>
      b.id === borrowingId
        ? {
            ...b,
            returnDate: new Date().toISOString(),
            status: "returned" as const,
          }
        : b,
    )
    setBorrowings(updatedBorrowings)
    localStorage.setItem("borrowings", JSON.stringify(updatedBorrowings))
  }

  const getUserBorrowings = (userId: string) => {
    return borrowings.filter((b) => b.userId === userId)
  }

  return (
    <BorrowingContext.Provider value={{ borrowings, borrowBook, returnBook, getUserBorrowings }}>
      {children}
    </BorrowingContext.Provider>
  )
}

export function useBorrowing() {
  const context = useContext(BorrowingContext)
  if (context === undefined) {
    throw new Error("useBorrowing must be used within a BorrowingProvider")
  }
  return context
}
