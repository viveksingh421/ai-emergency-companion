"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  emergencyContacts: Array<{ id: string; name: string; phone: string }>
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session from localStorage and verify with backend
  useEffect(() => {
    const loadSession = async () => {
      const savedToken = localStorage.getItem("auth_token")
      if (savedToken) {
        setToken(savedToken)
        try {
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("auth_token")
            setToken(null)
          }
        } catch {
          setToken(null)
          localStorage.removeItem("auth_token")
        }
      }
      setIsLoading(false)
    }
    loadSession()
  }, [])

  const register = async (email: string, name: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      })

      const data = await response.json()
      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch {
      console.log("[v0] Failed to refresh user")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
