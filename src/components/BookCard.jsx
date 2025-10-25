"use client"

import "../styles/BookCard.css"

export default function BookCard({ book, onClick, isBorrowed }) {
  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-image">
        <img src={book.image || "/placeholder.svg"} alt={book.title} />
        {isBorrowed && <div className="borrowed-badge">Borrowed</div>}
        {book.availableCopies === 0 && !isBorrowed && <div className="unavailable-badge">Unavailable</div>}
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="genre">{book.genre}</p>
        <p className="copies">
          {book.availableCopies > 0 ? `${book.availableCopies} available` : "No copies available"}
        </p>
      </div>
    </div>
  )
}
