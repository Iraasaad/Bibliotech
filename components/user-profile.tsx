"use client"

import { useAuth } from "@/context/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBorrowing } from "@/context/borrowing-context"
import { BOOKS } from "@/lib/books-data"
import { formatDate, getDaysUntilDue, isOverdue } from "@/lib/borrowing-data"

export function UserProfile() {
  const { user } = useAuth()
  const { getUserBorrowings, returnBook } = useBorrowing()

  if (!user) return null

  const userBorrowings = getUserBorrowings(user.email)
  const activeBorrowings = userBorrowings.filter((b) => b.status === "active")
  const returnedBorrowings = userBorrowings.filter((b) => b.status === "returned")

  const getBookTitle = (bookId: string) => {
    return BOOKS.find((b) => b.id === bookId)?.title || "Unknown Book"
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-base sm:text-lg font-semibold text-foreground">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-base sm:text-lg font-semibold text-foreground break-all">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="text-base sm:text-lg font-semibold text-foreground">2024</p>
          </div>
        </div>
      </Card>

      {/* Borrowing Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Active Borrowings</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{activeBorrowings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Borrowed</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{userBorrowings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Returned</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{returnedBorrowings.length}</p>
        </Card>
      </div>

      {/* Active Borrowings */}
      <Card className="p-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Currently Borrowed</h3>
        {activeBorrowings.length > 0 ? (
          <div className="space-y-3">
            {activeBorrowings.map((borrowing) => {
              const daysUntilDue = getDaysUntilDue(borrowing.dueDate)
              const overdue = isOverdue(borrowing.dueDate)

              return (
                <div
                  key={borrowing.id}
                  className="border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base break-words">
                      {getBookTitle(borrowing.bookId)}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Borrowed: {formatDate(borrowing.borrowDate)}
                    </p>
                    <p className={`text-xs sm:text-sm font-medium ${overdue ? "text-red-600" : "text-green-600"}`}>
                      {overdue ? (
                        <>Overdue by {Math.abs(daysUntilDue)} days</>
                      ) : (
                        <>
                          Due in {daysUntilDue} days ({formatDate(borrowing.dueDate)})
                        </>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => returnBook(borrowing.id)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Return
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No active borrowings</p>
        )}
      </Card>

      {/* Borrowing History */}
      <Card className="p-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Borrowing History</h3>
        {returnedBorrowings.length > 0 ? (
          <div className="space-y-3">
            {returnedBorrowings.map((borrowing) => (
              <div key={borrowing.id} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground text-sm sm:text-base">{getBookTitle(borrowing.bookId)}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Borrowed: {formatDate(borrowing.borrowDate)} - Returned: {formatDate(borrowing.returnDate || "")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No borrowing history</p>
        )}
      </Card>
    </div>
  )
}
