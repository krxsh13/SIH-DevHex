"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient, type User as ApiUser } from "./api"

export type UserRole = "admin" | "alumni" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileComplete?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert API user to frontend user
const convertApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser._id,
  email: apiUser.email,
  name: `${apiUser.firstName} ${apiUser.lastName}`,
  role: apiUser.role as UserRole,
  profileComplete: !!apiUser.profile && Object.keys(apiUser.profile).length > 0,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Always start with no user - require fresh login every time
    // This ensures the app always asks for login/registration
    console.log('Starting fresh session - no persistent login')
    setUser(null)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setError(null)
      const response = await apiClient.login({ email, password })

      if (response.success && response.data) {
        const userData = convertApiUserToUser(response.data.user)
        // Don't persist login - only keep in memory for current session
        setUser(userData)
        return true
      } else {
        setError(response.error?.message || "Login failed")
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("Network error. Please try again.")
      return false
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole): Promise<boolean> => {
    try {
      setError(null)
      const response = await apiClient.signup({
        email,
        password,
        firstName,
        lastName,
        role,
      })

      if (response.success && response.data) {
        const userData = convertApiUserToUser(response.data.user)
        // Don't persist login - only keep in memory for current session
        setUser(userData)
        return true
      } else {
        setError(response.error?.message || "Registration failed")
        return false
      }
    } catch (error) {
      console.error("Signup failed:", error)
      setError("Network error. Please try again.")
      return false
    }
  }

  const logout = () => {
    try {
      console.log('Logging out user...')
      apiClient.logout()
      // Clear any existing localStorage data
      localStorage.removeItem("auth-token")
      localStorage.removeItem("user-data")
      setUser(null)
      setError(null)
      console.log('User logged out successfully - session cleared')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
