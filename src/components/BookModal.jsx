"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { borrowBook, reserveBook } from "../utils/storage"
import "../styles/BookModal.css"

export default function BookModal({ book, user, onClose, onBorrow }) {
  const [message, setMessage] = useState("")

  const handleBorrow = () => {
    if (book.availableCopies > 0) {
      borrowBook(book.id, user.id)
      setMessage("Book borrowed successfully!")
      setTimeout(() => {
        onBorrow()
        onClose()
      }, 1500)
    }
  }

  const handleReserve = () => {
    reserveBook(book.id, user.id)
    setMessage("Book reserved successfully!")
    setTimeout(() => {
      onBorrow()
      onClose()
    }, 1500)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          <div className="modal-image">
            <img src={book.image || "/placeholder.svg"} alt={book.title} />
          </div>

          <div className="modal-info">
            <h2>{book.title}</h2>
            <p className="modal-author">{book.author}</p>
            <p className="modal-genre">{book.genre}</p>
            <p className="modal-isbn">ISBN: {book.isbn}</p>

            <div className="modal-availability">
              <p>
                Available Copies: <strong>{book.availableCopies}</strong>
              </p>
              <p>
                Total Copies: <strong>{book.copies}</strong>
              </p>
            </div>

            {message && <div className="success-message">{message}</div>}

            <div className="modal-actions">
              {!book.userBorrowing && book.availableCopies > 0 && (
                <button onClick={handleBorrow} className="btn btn-primary">
                  Borrow Book
                </button>
              )}
              {!book.userBorrowing && book.availableCopies === 0 && (
                <button onClick={handleReserve} className="btn btn-secondary">
                  Reserve Book
                </button>
              )}
              {book.userBorrowing && (
                <div className="borrowed-info">
                  <p>You are currently borrowing this book</p>
                  <p>Due Date: {new Date(book.userBorrowing.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
