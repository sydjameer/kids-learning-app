"use client"

import { motion } from "framer-motion"
import { useProgress } from "@/contexts/progress-context"

export function OverallProgress() {
  const { overallCompletionPercentage } = useProgress()

  return (
    <motion.div
      className="fixed top-4 right-4 bg-white rounded-full shadow-md p-2 z-50 flex items-center gap-2"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
        {overallCompletionPercentage}%
      </div>
      <div className="hidden sm:block text-xs font-medium text-gray-600">Overall Progress</div>
    </motion.div>
  )
}
