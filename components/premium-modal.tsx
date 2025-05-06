"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { usePremium } from "@/contexts/premium-context"
import { useSound } from "@/contexts/sound-context"
import { X, Star, Coffee, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export function PremiumModal() {
  const { showSupportModal, setShowSupportModal, redirectToSupport } = usePremium()
  const { playClick } = useSound()
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  if (!showSupportModal) return null

  const handleClose = () => {
    if (playClick) playClick()
    setShowSupportModal(false)
  }

  const handleSupport = () => {
    if (playClick) playClick()
    setIsAnimating(true)
    setTimeout(() => {
      setShowSupportModal(false)
      router.push("/support")
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full relative border-4 border-amber-400"
        style={{ fontFamily: "ChildsPlay, sans-serif" }}
      >
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                rotate: isAnimating ? [0, 10, -10, 10, -10, 0] : 0,
                scale: isAnimating ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Coffee className="h-24 w-24 text-amber-500" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-amber-600 mb-4">Support MIT Learn!</h2>

          <p className="text-lg text-gray-700 mb-6">
            MIT Learn is completely free! If you find it helpful, consider supporting our mission with a small
            contribution.
          </p>

          <div className="bg-amber-100 rounded-xl p-4 mb-6">
            <h3 className="text-xl font-bold text-amber-600 mb-2 flex items-center justify-center">
              <Heart className="mr-2 text-amber-500" /> Why Support Us?
            </h3>
            <ul className="text-left space-y-2">
              <motion.li
                className="flex items-center text-gray-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Star className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <span>Help us maintain and improve the app</span>
              </motion.li>
              <motion.li
                className="flex items-center text-gray-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Star className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <span>Support development of new features</span>
              </motion.li>
              <motion.li
                className="flex items-center text-gray-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Star className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <span>Help us create more educational content</span>
              </motion.li>
            </ul>
          </div>

          <div className="flex justify-center">
            <motion.button
              onClick={handleSupport}
              className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isAnimating ? { y: [0, -10, 0] } : {}}
            >
              <Coffee className="mr-2" />
              Buy us a coffee ($2.00)
            </motion.button>
          </div>

          <p className="text-sm text-gray-500 mt-4">Your support helps us continue our mission!</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
