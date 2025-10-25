export interface Borrowing {
  id: string
  userId: string
  bookId: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: "active" | "returned" | "overdue"
}

export interface UserBorrowingData {
  userId: string
  borrowings: Borrowing[]
}

// Helper function to calculate due date (14 days from borrow date)
export function calculateDueDate(borrowDate: Date): Date {
  const dueDate = new Date(borrowDate)
  dueDate.setDate(dueDate.getDate() + 14)
  return dueDate
}

// Helper function to check if a borrowing is overdue
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Helper function to get days until due
export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
