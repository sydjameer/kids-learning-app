"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogIn, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { useSound } from "@/contexts/sound-context"

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { playClick } = useSound()

  const handleSignInClick = () => {
    if (playClick) playClick()
    setIsAuthModalOpen(true)
  }

  const handleSignOutClick = () => {
    if (playClick) playClick()
    signOut()
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    if (playClick) playClick()
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="relative">
          <motion.button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-4 w-4" />
            <span className="max-w-[100px] truncate">{user?.username}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </motion.button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10"
            >
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Signed in as</p>
                <p className="text-sm text-gray-500 truncate">{user?.username}</p>
              </div>
              <button
                onClick={handleSignOutClick}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                Sign out
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.button
          onClick={handleSignInClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogIn className="h-4 w-4 mr-1" />
          <span>Sign In</span>
        </motion.button>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
