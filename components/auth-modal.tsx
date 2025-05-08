"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, User, Lock, LogIn, UserPlus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let success = false

      if (mode === "signin") {
        success = await signIn(username, password)
      } else {
        if (!username.trim()) {
          setError("Username is required")
          setIsSubmitting(false)
          return
        }
        success = await signUp(username, password)
      }

      if (success) {
        onClose()
      } else {
        setError(
          mode === "signin"
            ? "Invalid username or password"
            : "Failed to create account. Username may already be taken.",
        )
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError(null)
    setUsername("")
    setPassword("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-fuchsia-600 mb-2">
            {mode === "signin" ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-gray-600">
            {mode === "signin"
              ? "Sign in to save your progress and access from any device"
              : "Join MIT Learn to track your progress and learn more effectively"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
                minLength={3}
              />
            </div>
            {mode === "signup" && <p className="text-xs text-gray-500 mt-1">Username must be at least 3 characters</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder={mode === "signin" ? "Your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
            {mode === "signup" && <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processing..."
            ) : mode === "signin" ? (
              <span className="flex items-center justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleMode} className="ml-1 text-fuchsia-600 hover:text-fuchsia-700 font-medium">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
