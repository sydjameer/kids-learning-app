"use client"

import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { useSound } from "@/contexts/sound-context"

export function SoundToggle() {
  const { isMuted, toggleMute, playClick } = useSound()

  const handleToggle = () => {
    if (playClick) playClick()
    toggleMute()
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-4 left-4 z-50 bg-white rounded-full p-3 shadow-md border border-gray-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {isMuted ? <VolumeX className="h-6 w-6 text-gray-600" /> : <Volume2 className="h-6 w-6 text-purple-600" />}
    </motion.button>
  )
}
