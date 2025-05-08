"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface AuthBannerProps {
  onSignInClick: () => void
}

export function AuthBanner({ onSignInClick }: AuthBannerProps) {
  const { isAuthenticated } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if user is authenticated or banner was dismissed
  if (isAuthenticated || isDismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="bg-gradient-to-r from-fuchsia-50 to-amber-50 border-l-4 border-fuchsia-400 p-5 mb-8 rounded-xl shadow-sm relative"
      style={{ fontFamily: "ChildsPlay, sans-serif" }}
    >
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 text-fuchsia-400 hover:text-fuchsia-600 bg-white rounded-full p-1 shadow-sm"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>

      <div className="flex items-start">
        <div className="bg-fuchsia-100 p-2 rounded-full mr-4 flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-fuchsia-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-fuchsia-600 mb-2">Your progress isn't saved</h3>
          <div className="text-gray-700 mb-4">
            <p>
              You're using MIT Learn without an account. Your progress will be stored locally but may be lost if you
              clear your browser data.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onSignInClick}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-md"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in to save your progress
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
