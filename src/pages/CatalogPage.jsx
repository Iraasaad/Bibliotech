"use client"

import { useState, useEffect } from "react"
import BookCard from "../components/BookCard"
import BookModal from "../components/BookModal"
import { getBooks, getBorrowings } from "../utils/storage"
import "../styles/CatalogPage.css"

export default function CatalogPage({ user }) {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBook, setSelectedBook] = useState(null)
  const [borrowings, setBorrowings] = useState([])

  const BOOKS_PER_PAGE = 6
  const GENRES = ["all", "Fiction", "Mystery", "Science Fiction", "Romance", "Biography", "History"]

  useEffect(() => {
    const allBooks = getBooks()
    setBooks(allBooks)
    const userBorrowings = getBorrowings().filter((b) => b.userId === user.id)
    setBorrowings(userBorrowings)
  }, [user.id])

  useEffect(() => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre)
    }

    setFilteredBooks(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedGenre, books])

  const paginatedBooks = filteredBooks.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE)

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)

  const handleBookClick = (book) => {
    const userBorrowing = borrowings.find((b) => b.bookId === book.id && !b.returnDate)
    setSelectedBook({ ...book, userBorrowing })
  }

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Book Catalog</h1>
        <p>Browse and borrow books from our collection</p>
      </div>

      <div className="catalog-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="genre-filter">
          <label>Genre:</label>
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="books-grid">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => handleBookClick(book)}
              isBorrowed={borrowings.some((b) => b.bookId === book.id && !b.returnDate)}
            />
          ))
        ) : (
          <div className="no-results">No books found matching your criteria.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          user={user}
          onClose={() => setSelectedBook(null)}
          onBorrow={() => {
            setBooks([...books])
            setSelectedBook(null)
          }}
        />
      )}
    </div>
  )
}
