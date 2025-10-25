"use client"

import { useState, useEffect } from "react"
import { getBooks, addBook, deleteBook } from "../utils/storage"
import "../styles/AdminPage.css"

export default function AdminPage({ user }) {
  const [books, setBooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    isbn: "",
    copies: 1,
    image: "/book-cover.jpg",
  })

  useEffect(() => {
    setBooks(getBooks())
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "copies" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBook = {
      id: Date.now(),
      ...formData,
      availableCopies: formData.copies,
    }
    addBook(newBook)
    setBooks(getBooks())
    setFormData({
      title: "",
      author: "",
      genre: "Fiction",
      isbn: "",
      copies: 1,
      image: "/book-cover.jpg",
    })
    setShowForm(false)
  }

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(bookId)
      setBooks(getBooks())
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Cancel" : "Add New Book"}
        </button>
      </div>

      {showForm && (
        <div className="add-book-form">
          <h2>Add New Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select id="genre" name="genre" value={formData.genre} onChange={handleInputChange}>
                  <option>Fiction</option>
                  <option>Mystery</option>
                  <option>Science Fiction</option>
                  <option>Romance</option>
                  <option>Biography</option>
                  <option>History</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input id="isbn" type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="copies">Number of Copies</label>
              <input
                id="copies"
                type="number"
                name="copies"
                min="1"
                value={formData.copies}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </form>
        </div>
      )}

      <div className="books-table">
        <h2>Books Management</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Copies</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.copies}</td>
                <td>{book.availableCopies}</td>
                <td>
                  <button onClick={() => handleDelete(book.id)} className="btn btn-danger btn-small">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
