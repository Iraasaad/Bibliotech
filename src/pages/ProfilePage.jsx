"use client"

import { useState, useEffect } from "react"
import { getBorrowings, getBooks } from "../utils/storage"
import "../styles/ProfilePage.css"

export default function ProfilePage({ user }) {
  const [borrowings, setBorrowings] = useState([])
  const [books, setBooks] = useState({})
  const [activeTab, setActiveTab] = useState("borrowed")

  useEffect(() => {
    const allBorrowings = getBorrowings().filter((b) => b.userId === user.id)
    setBorrowings(allBorrowings)

    const allBooks = getBooks()
    const booksMap = {}
    allBooks.forEach((book) => {
      booksMap[book.id] = book
    })
    setBooks(booksMap)
  }, [user.id])

  const borrowedBooks = borrowings.filter((b) => !b.returnDate)
  const returnedBooks = borrowings.filter((b) => b.returnDate)
  const reservedBooks = borrowings.filter((b) => b.reserved && !b.borrowDate)

  const handleReturn = (borrowingId) => {
    const updatedBorrowings = borrowings.map((b) =>
      b.id === borrowingId ? { ...b, returnDate: new Date().toISOString().split("T")[0] } : b,
    )
    setBorrowings(updatedBorrowings)
    localStorage.setItem("borrowings", JSON.stringify(updatedBorrowings))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="user-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "borrowed" ? "active" : ""}`}
          onClick={() => setActiveTab("borrowed")}
        >
          Currently Borrowed ({borrowedBooks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "reserved" ? "active" : ""}`}
          onClick={() => setActiveTab("reserved")}
        >
          Reserved ({reservedBooks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History ({returnedBooks.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "borrowed" && (
          <div className="borrowings-list">
            {borrowedBooks.length > 0 ? (
              borrowedBooks.map((borrowing) => (
                <div key={borrowing.id} className={`borrowing-item ${isOverdue(borrowing.dueDate) ? "overdue" : ""}`}>
                  <div className="borrowing-info">
                    <h3>{books[borrowing.bookId]?.title}</h3>
                    <p className="author">{books[borrowing.bookId]?.author}</p>
                    <div className="dates">
                      <span>Borrowed: {formatDate(borrowing.borrowDate)}</span>
                      <span className={isOverdue(borrowing.dueDate) ? "overdue-text" : ""}>
                        Due: {formatDate(borrowing.dueDate)}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleReturn(borrowing.id)} className="btn btn-secondary">
                    Return Book
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-message">You haven't borrowed any books yet.</p>
            )}
          </div>
        )}

        {activeTab === "reserved" && (
          <div className="borrowings-list">
            {reservedBooks.length > 0 ? (
              reservedBooks.map((borrowing) => (
                <div key={borrowing.id} className="borrowing-item">
                  <div className="borrowing-info">
                    <h3>{books[borrowing.bookId]?.title}</h3>
                    <p className="author">{books[borrowing.bookId]?.author}</p>
                    <p className="reserved-status">Reserved on {formatDate(borrowing.reserveDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">You haven't reserved any books.</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="borrowings-list">
            {returnedBooks.length > 0 ? (
              returnedBooks.map((borrowing) => (
                <div key={borrowing.id} className="borrowing-item">
                  <div className="borrowing-info">
                    <h3>{books[borrowing.bookId]?.title}</h3>
                    <p className="author">{books[borrowing.bookId]?.author}</p>
                    <div className="dates">
                      <span>Borrowed: {formatDate(borrowing.borrowDate)}</span>
                      <span>Returned: {formatDate(borrowing.returnDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No borrowing history yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
