"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import CatalogPage from "./pages/CatalogPage"
import ProfilePage from "./pages/ProfilePage"
import AdminPage from "./pages/AdminPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/catalog" element={user ? <CatalogPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
            <Route
              path="/admin"
              element={user?.role === "admin" ? <AdminPage user={user} /> : <Navigate to="/catalog" />}
            />
            <Route path="/" element={user ? <Navigate to="/catalog" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  )
}

export default App
