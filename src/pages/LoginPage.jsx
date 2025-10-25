"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/LoginPage.css"

const DEMO_USERS = [
  { id: 1, email: "user@example.com", password: "user123", name: "John Doe", role: "user" },
  { id: 2, email: "admin@library.com", password: "admin123", name: "Admin User", role: "admin" },
]

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      onLogin(user)
      navigate("/catalog")
    } else {
      setError("Invalid email or password")
    }
  }

  const fillDemoUser = (demoUser) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
    setError("")
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>BiblioTech</h1>
          <p>Library Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Demo Accounts</p>
          <button type="button" className="demo-btn" onClick={() => fillDemoUser(DEMO_USERS[0])}>
            User Account
            <span className="demo-email">{DEMO_USERS[0].email}</span>
          </button>
          <button type="button" className="demo-btn" onClick={() => fillDemoUser(DEMO_USERS[1])}>
            Admin Account
            <span className="demo-email">{DEMO_USERS[1].email}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
