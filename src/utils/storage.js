const INITIAL_BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    isbn: "978-0743273565",
    copies: 3,
    availableCopies: 2,
    image: "/the-great-gatsby.jpg",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    isbn: "978-0061120084",
    copies: 2,
    availableCopies: 1,
    image: "/to-kill-a-mockingbird.jpg",
  },
  {
    id: 3,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    isbn: "978-0316769174",
    copies: 2,
    availableCopies: 2,
    image: "/catcher-in-the-rye.jpg",
  },
  {
    id: 4,
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    genre: "Mystery",
    isbn: "978-0062693556",
    copies: 3,
    availableCopies: 3,
    image: "/murder-orient-express.jpg",
  },
  {
    id: 5,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Mystery",
    isbn: "978-0307454546",
    copies: 2,
    availableCopies: 1,
    image: "/girl-dragon-tattoo.jpg",
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    isbn: "978-0441172719",
    copies: 2,
    availableCopies: 2,
    image: "/dune.jpg",
  },
  {
    id: 7,
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    isbn: "978-0451524935",
    copies: 3,
    availableCopies: 2,
    image: "/1984-book-cover.png",
  },
  {
    id: 8,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0141439518",
    copies: 2,
    availableCopies: 1,
    image: "/pride-prejudice.jpg",
  },
  {
    id: 9,
    title: "The Notebook",
    author: "Nicholas Sparks",
    genre: "Romance",
    isbn: "978-0446676052",
    copies: 2,
    availableCopies: 2,
    image: "/the-notebook.jpg",
  },
  {
    id: 10,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biography",
    isbn: "978-1451648539",
    copies: 2,
    availableCopies: 2,
    image: "/steve-jobs.jpg",
  },
  {
    id: 11,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science Fiction",
    isbn: "978-0553380163",
    copies: 2,
    availableCopies: 1,
    image: "/brief-history-time.jpg",
  },
  {
    id: 12,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fiction",
    isbn: "978-0547928227",
    copies: 3,
    availableCopies: 2,
    image: "/the-hobbit.jpg",
  },
  {
    id: 13,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    isbn: "978-0062316097",
    copies: 2,
    availableCopies: 2,
    image: "/sapiens.jpg",
  },
  {
    id: 14,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    isbn: "978-0307474278",
    copies: 2,
    availableCopies: 1,
    image: "/da-vinci-code.jpg",
  },
]

export function getBooks() {
  const stored = localStorage.getItem("books")
  return stored ? JSON.parse(stored) : INITIAL_BOOKS
}

export function addBook(book) {
  const books = getBooks()
  books.push(book)
  localStorage.setItem("books", JSON.stringify(books))
}

export function deleteBook(bookId) {
  const books = getBooks().filter((b) => b.id !== bookId)
  localStorage.setItem("books", JSON.stringify(books))
}

export function borrowBook(bookId, userId) {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book && book.availableCopies > 0) {
    book.availableCopies--
    localStorage.setItem("books", JSON.stringify(books))

    const borrowings = getBorrowings()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    borrowings.push({
      id: Date.now(),
      bookId,
      userId,
      borrowDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      returnDate: null,
      reserved: false,
    })
    localStorage.setItem("borrowings", JSON.stringify(borrowings))
  }
}

export function reserveBook(bookId, userId) {
  const borrowings = getBorrowings()
  borrowings.push({
    id: Date.now(),
    bookId,
    userId,
    borrowDate: null,
    dueDate: null,
    returnDate: null,
    reserved: true,
    reserveDate: new Date().toISOString().split("T")[0],
  })
  localStorage.setItem("borrowings", JSON.stringify(borrowings))
}

export function getBorrowings() {
  const stored = localStorage.getItem("borrowings")
  return stored ? JSON.parse(stored) : []
}
