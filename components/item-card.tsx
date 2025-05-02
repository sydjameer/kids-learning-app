"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Lock } from "lucide-react"
import { useProgress } from "@/contexts/progress-context"
import { usePremium } from "@/contexts/premium-context"
import { useSound } from "@/contexts/sound-context"

interface ItemCardProps {
  id: number
  image: string
  name: string
  category: string
  isPremium: boolean
  onClick: () => void
}

export function ItemCard({ id, image, name, category, isPremium, onClick }: ItemCardProps) {
  const { isItemCompleted, getItemStars } = useProgress()
  const { isPremium: hasPremium, setShowPremiumModal } = usePremium()
  const { playClick } = useSound()

  const completed = isItemCompleted(id)
  const stars = getItemStars(id)

  // Get background color based on category
  const getBgColor = (category: string) => {
    switch (category) {
      case "Fruits":
        return "bg-green-100"
      case "Animals":
        return "bg-yellow-100"
      case "Vehicles":
        return "bg-blue-100"
      case "Nature":
        return "bg-purple-100"
      default:
        return "bg-gray-100"
    }
  }

  // Get text color based on category
  const getTextColor = (category: string) => {
    switch (category) {
      case "Fruits":
        return "text-green-600"
      case "Animals":
        return "text-yellow-600"
      case "Vehicles":
        return "text-blue-600"
      case "Nature":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const bgColor = getBgColor(category)
  const textColor = getTextColor(category)

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
        className={`h-full overflow-hidden cursor-pointer ${bgColor} border-2 relative`}
        onClick={handleClick}
        style={{ fontFamily: "ChildsPlay, sans-serif" }}
      >
        {completed && (
          <motion.div
            className="absolute top-2 right-2 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckCircle className="h-6 w-6 text-green-500 fill-white" />
          </motion.div>
        )}

        {isPremium && !hasPremium && (
          <motion.div
            className="absolute top-2 left-2 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <div className="bg-yellow-400 rounded-full p-1">
              <Lock className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        )}

        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="relative w-32 h-32 mb-4"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                fill
                className={`object-contain ${isPremium && !hasPremium ? "opacity-50" : ""}`}
              />
            </motion.div>
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>{name}</h3>
            <p className="text-gray-600 mb-2">{category}</p>

            {completed && (
              <div className="flex items-center mt-2">
                {[...Array(stars)].map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
