"use client"

import { useBorrowing } from "@/context/borrowing-context"
import { Card } from "@/components/ui/card"
import { BOOKS } from "@/lib/books-data"
import { calculateBookStats, calculateBorrowingStats, getMostBorrowedBooks, getBookById } from "@/lib/admin-data"
import { formatDate } from "@/lib/borrowing-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function AdminDashboard() {
  const { borrowings } = useBorrowing()

  const bookStats = calculateBookStats()
  const borrowingStats = calculateBorrowingStats(borrowings)
  const mostBorrowedBooks = getMostBorrowedBooks(borrowings)

  // Data for pie chart
  const availabilityData = [
    { name: "Available", value: bookStats.availableCopies },
    { name: "Borrowed", value: bookStats.borrowedCopies },
  ]

  const COLORS = ["#10b981", "#ef4444"]

  // Data for most borrowed books chart
  const mostBorrowedData = mostBorrowedBooks.map((item) => ({
    name: getBookById(item.bookId)?.title || "Unknown",
    borrowings: item.count,
  }))

  // Overdue borrowings
  const overdueBorrowings = borrowings.filter((b) => {
    if (b.status !== "active") return false
    return new Date(b.dueDate) < new Date()
  })

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Books</p>
          <p className="text-3xl font-bold text-foreground">{bookStats.totalBooks}</p>
          <p className="text-xs text-muted-foreground mt-2">{bookStats.totalCopies} total copies</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Available Copies</p>
          <p className="text-3xl font-bold text-green-600">{bookStats.availableCopies}</p>
          <p className="text-xs text-muted-foreground mt-2">{bookStats.averageAvailability}% availability</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Borrowings</p>
          <p className="text-3xl font-bold text-blue-600">{borrowingStats.activeBorrowings}</p>
          <p className="text-xs text-muted-foreground mt-2">Currently borrowed</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Overdue Items</p>
          <p className="text-3xl font-bold text-red-600">{borrowingStats.overdueBorrowings}</p>
          <p className="text-xs text-muted-foreground mt-2">Require attention</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Book Availability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={availabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Borrowed Books */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Most Borrowed Books</h3>
          {mostBorrowedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostBorrowedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrowings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No borrowing data yet</p>
          )}
        </Card>
      </div>

      {/* Book Inventory */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Book Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Author</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Available</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Borrowed</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {BOOKS.map((book) => (
                <tr key={book.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground">{book.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                  <td className="py-3 px-4 text-center text-foreground">{book.total}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-green-600 font-semibold">{book.available}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-blue-600 font-semibold">{book.total - book.available}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        book.available > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.available > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Overdue Borrowings */}
      {overdueBorrowings.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Overdue Borrowings</h3>
          <div className="space-y-3">
            {overdueBorrowings.map((borrowing) => {
              const book = getBookById(borrowing.bookId)
              const daysOverdue = Math.ceil(
                (new Date().getTime() - new Date(borrowing.dueDate).getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <div
                  key={borrowing.id}
                  className="flex justify-between items-center p-3 bg-white rounded border border-red-200"
                >
                  <div>
                    <p className="font-semibold text-foreground">{book?.title || "Unknown Book"}</p>
                    <p className="text-sm text-muted-foreground">
                      User: {borrowing.userId} | Due: {formatDate(borrowing.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{daysOverdue} days overdue</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Borrowing Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Borrowing Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Borrowings</p>
            <p className="text-2xl font-bold text-foreground">{borrowingStats.totalBorrowings}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-blue-600">{borrowingStats.activeBorrowings}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Returned</p>
            <p className="text-2xl font-bold text-green-600">{borrowingStats.returnedBorrowings}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{borrowingStats.overdueBorrowings}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
