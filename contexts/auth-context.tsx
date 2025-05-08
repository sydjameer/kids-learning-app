"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// API URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
const REGISTER_URL = `${API_BASE_URL}/auth/register`
const LOGIN_URL = `${API_BASE_URL}/auth/login`
const REFRESH_TOKEN_URL = `${API_BASE_URL}/auth/refresh-token`
const USER_PROFILE_URL = `${API_BASE_URL}/users/me`

interface User {
  username: string
  id?: string
  email?: string
  phone_number?: string
  is_parent?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signUp: (username: string, password: string) => Promise<boolean>
  signOut: () => void
  refreshToken: () => Promise<boolean>
}

interface TokenResponse {
  refresh: string
  access?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to get tokens from localStorage
  const getTokens = () => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    return { accessToken, refreshToken }
  }

  // Helper function to set tokens in localStorage
  const setTokens = (accessToken: string | null, refreshToken: string | null) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
  }

  // Helper function to clear tokens from localStorage
  const clearTokens = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }

  // Fetch user profile using the access token
  const fetchUserProfile = async (accessToken: string): Promise<User | null> => {
    try {
      const response = await fetch(USER_PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const userData = await response.json()
      return userData
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  // Refresh the access token using the refresh token
  const refreshToken = async (): Promise<boolean> => {
    const { refreshToken } = getTokens()

    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch(REFRESH_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const data: TokenResponse = await response.json()

      // Store the new access token
      if (data.access) {
        setTokens(data.access, null)
        return true
      }

      return false
    } catch (error) {
      console.error("Error refreshing token:", error)
      return false
    }
  }

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { accessToken, refreshToken } = getTokens()

        // If we have both tokens
        if (accessToken && refreshToken) {
          // Try to fetch user profile with current access token
          const userData = await fetchUserProfile(accessToken)

          if (userData) {
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
          } else {
            // If that fails, try to refresh the token
            const refreshed = await refreshToken()

            if (refreshed) {
              // Try again with the new token
              const { accessToken: newAccessToken } = getTokens()
              if (newAccessToken) {
                const newUserData = await fetchUserProfile(newAccessToken)
                if (newUserData) {
                  setUser(newUserData)
                  localStorage.setItem("user", JSON.stringify(newUserData))
                }
              }
            } else {
              // If refresh fails, clear everything
              clearTokens()
            }
          }
        } else {
          // No tokens, check if we have cached user data
          const cachedUser = localStorage.getItem("user")
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser))
            } catch (e) {
              localStorage.removeItem("user")
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Sign in function
  const signIn = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data: TokenResponse = await response.json()

      // Store the tokens
      setTokens(data.access || null, data.refresh)

      // Fetch user profile
      if (data.access) {
        const userData = await fetchUserProfile(data.access)
        if (userData) {
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          return true
        }
      } else if (data.refresh) {
        // If we only got refresh token, try to get an access token
        const refreshed = await refreshToken()
        if (refreshed) {
          const { accessToken } = getTokens()
          if (accessToken) {
            const userData = await fetchUserProfile(accessToken)
            if (userData) {
              setUser(userData)
              localStorage.setItem("user", JSON.stringify(userData))
              return true
            }
          }
        }
      }

      return false
    } catch (error) {
      console.error("Sign in error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Create a registration payload with default values
      const registrationData = {
        username,
        password,
        email: `${username}@example.com`, // Placeholder email
        phone_number: "1234567890", // Placeholder phone
        is_parent: true, // Default to parent
      }

      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // After successful registration, sign in
      return await signIn(username, password)
    } catch (error) {
      console.error("Sign up error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    clearTokens()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
