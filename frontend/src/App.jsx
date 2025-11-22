"use client"

import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import "./App.css"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = async (email, password, isSignup = false, name = "") => {
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login"
      const body = isSignup ? { email, password, name } : { email, password }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        const user = { id: data.user.id, email: data.user.email, name: data.user.name }
        setUserInfo(user)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(user))
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserInfo(null)
    setCurrentPage("login")
    localStorage.removeItem("user")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-purple-700 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userInfo={userInfo}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App
