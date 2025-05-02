"use client"

import { motion } from "framer-motion"
import { useProgress } from "@/contexts/progress-context"
import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ProgressSummary() {
  const { totalItems, completedItems, totalStars, overallCompletionPercentage } = useProgress()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-md border-2 border-fuchsia-200"
      style={{ fontFamily: "ChildsPlay, sans-serif" }}
    >
      <h2 className="text-xl font-bold text-fuchsia-600 mb-4">Your Learning Journey</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Items Learned</span>
            <span className="font-bold text-fuchsia-600">
              {completedItems} of {totalItems}
            </span>
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }}>
            <Progress value={overallCompletionPercentage} className="h-3 bg-fuchsia-100" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Stars Earned</span>
          <motion.div
            className="flex items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <span className="font-bold text-fuchsia-600 mr-2">{totalStars}</span>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </motion.div>
        </div>

        {completedItems === totalItems && totalItems > 0 ? (
          <motion.div
            className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-bold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Congratulations! You've learned all items! 🎉
          </motion.div>
        ) : (
          <motion.div
            className="mt-4 p-3 bg-pink-50 text-pink-600 rounded-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Keep going! You're doing great! 🚀
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
