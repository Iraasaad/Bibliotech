"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import "../styles/Navbar.css"

export default function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/catalog" className="navbar-logo">
          <span className="logo-icon">📚</span>
          BiblioTech
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          <Link to="/catalog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Catalog
          </Link>
          <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            My Profile
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-small">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
