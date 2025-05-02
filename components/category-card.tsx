"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProgress } from "@/contexts/progress-context"
import { usePremium } from "@/contexts/premium-context"
import { useSound } from "@/contexts/sound-context"
import { Lock } from "lucide-react"

interface CategoryCardProps {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  lessonCount: number
  isPremium: boolean
  onClick: () => void
}

export function CategoryCard({ id, name, icon, color, bgColor, lessonCount, isPremium, onClick }: CategoryCardProps) {
  const { getCategoryCompletionPercentage } = useProgress()
  const { isPremium: hasPremium, setShowPremiumModal } = usePremium()
  const { playClick } = useSound()

  const completionPercentage = getCategoryCompletionPercentage(id)

  const handleClick = () => {
    playClick()
    if (isPremium && !hasPremium) {
      setShowPremiumModal(true)
    } else {
      onClick()
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`h-full overflow-hidden cursor-pointer border-2 ${bgColor} ${isPremium && !hasPremium ? "opacity-80" : ""}`}
        onClick={handleClick}
        style={{ fontFamily: "ChildsPlay, sans-serif" }}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <motion.div
              className={`text-4xl ${bgColor} rounded-full w-16 h-16 flex items-center justify-center relative`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
              {isPremium && !hasPremium && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Lock className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${color} mb-2`}>{name}</h3>
              <div className="text-sm text-gray-600 mb-2">{lessonCount} Lessons</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className={`text-xs font-medium ${color}`}>{completionPercentage}%</span>
              </div>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Progress value={completionPercentage} className={`h-2 ${bgColor}`} />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
