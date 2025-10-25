"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BOOKS, CATEGORIES, type Book } from "@/lib/books-data"
import { Search, Filter } from "lucide-react"
import { useBorrowing } from "@/context/borrowing-context"
import { useAuth } from "@/context/auth-context"

export function BooksCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"title" | "author" | "year">("title")
  const { borrowBook, getUserBorrowings } = useBorrowing()
  const { user } = useAuth()

  const filteredBooks = useMemo(() => {
    let result = BOOKS

    if (selectedCategory !== "All") {
      result = result.filter((book) => book.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.includes(query),
      )
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "author") {
        return a.author.localeCompare(b.author)
      } else {
        return b.year - a.year
      }
    })

    return result
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-sm sm:text-base"
        />
      </div>

      {/* Filters and Sort */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full text-xs sm:text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm font-medium text-foreground w-full">Sort by:</span>
          {(["title", "author", "year"] as const).map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option)}
              className="capitalize text-xs sm:text-sm"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Found {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  const { borrowBook } = useBorrowing()
  const { user } = useAuth()

  const userBorrowings = useBorrowing().getUserBorrowings(user?.email || "")
  const userHasBorrowed = userBorrowings.some((b) => b.bookId === book.id && b.status === "active")

  const handleBorrow = () => {
    borrowBook(book.id)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Book Cover */}
        <div
          className={`w-full sm:w-24 h-24 sm:h-auto ${book.coverColor} flex-shrink-0 flex items-center justify-center`}
        >
          <div className="text-white text-center px-2">
            <div className="text-xs font-bold line-clamp-2">{book.title}</div>
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">{book.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{book.author}</p>
            <p className="text-xs text-muted-foreground mt-1">{book.year}</p>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Available:</span>
              <span className={book.available > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {book.available}/{book.total}
              </span>
            </div>
            <Button
              size="sm"
              variant={book.available > 0 ? "default" : "outline"}
              disabled={book.available === 0}
              onClick={handleBorrow}
              className="w-full text-xs sm:text-sm"
            >
              {userHasBorrowed ? "Already Borrowed" : book.available > 0 ? "Borrow" : "Unavailable"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
