import { BOOKS } from "./books-data"
import type { Borrowing } from "./borrowing-data"

export interface BookStats {
  totalBooks: number
  totalCopies: number
  availableCopies: number
  borrowedCopies: number
  averageAvailability: number
}

export interface BorrowingStats {
  totalBorrowings: number
  activeBorrowings: number
  returnedBorrowings: number
  overdueBorrowings: number
}

export function calculateBookStats(): BookStats {
  const totalBooks = BOOKS.length
  const totalCopies = BOOKS.reduce((sum, book) => sum + book.total, 0)
  const availableCopies = BOOKS.reduce((sum, book) => sum + book.available, 0)
  const borrowedCopies = totalCopies - availableCopies
  const averageAvailability = Math.round((availableCopies / totalCopies) * 100)

  return {
    totalBooks,
    totalCopies,
    availableCopies,
    borrowedCopies,
    averageAvailability,
  }
}

export function calculateBorrowingStats(borrowings: Borrowing[]): BorrowingStats {
  const totalBorrowings = borrowings.length
  const activeBorrowings = borrowings.filter((b) => b.status === "active").length
  const returnedBorrowings = borrowings.filter((b) => b.status === "returned").length
  const overdueBorrowings = borrowings.filter((b) => {
    if (b.status !== "active") return false
    return new Date(b.dueDate) < new Date()
  }).length

  return {
    totalBorrowings,
    activeBorrowings,
    returnedBorrowings,
    overdueBorrowings,
  }
}

export function getMostBorrowedBooks(borrowings: Borrowing[]): Array<{ bookId: string; count: number }> {
  const bookBorrowCounts: Record<string, number> = {}

  borrowings.forEach((borrowing) => {
    bookBorrowCounts[borrowing.bookId] = (bookBorrowCounts[borrowing.bookId] || 0) + 1
  })

  return Object.entries(bookBorrowCounts)
    .map(([bookId, count]) => ({ bookId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export function getBookById(bookId: string) {
  return BOOKS.find((b) => b.id === bookId)
}
