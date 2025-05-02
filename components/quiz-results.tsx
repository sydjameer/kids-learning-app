"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, Trophy, RotateCw, Home } from "lucide-react"
import Link from "next/link"
import { useSound } from "@/contexts/sound-context"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  onRetry: () => void
  lessonId: number
}

export function QuizResults({ score, totalQuestions, onRetry, lessonId }: QuizResultsProps) {
  const { playClick, playSuccess } = useSound()
  const percentage = Math.round((score / totalQuestions) * 100)

  // Play success sound when results are shown
  if (playSuccess && percentage >= 70) {
    playSuccess()
  }

  const handleRetry = () => {
    if (playClick) playClick()
    onRetry()
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto w-32 h-32 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center mb-4"
        >
          {percentage >= 70 ? <Trophy className="h-16 w-16 text-white" /> : <Star className="h-16 w-16 text-white" />}
        </motion.div>

        <h2 className="text-3xl font-bold text-fuchsia-600 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-700 mb-4">
          You scored <span className="font-bold text-fuchsia-600">{score}</span> out of{" "}
          <span className="font-bold">{totalQuestions}</span>
        </p>

        <div className="w-full max-w-md mx-auto h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${
              percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
        </div>

        <p className="text-2xl font-bold mb-6">
          {percentage}% {percentage >= 70 ? "🎉" : ""}
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gray-700 mb-3">
            {percentage >= 70
              ? "Great job! You've mastered this lesson!"
              : percentage >= 40
                ? "Good effort! Keep practicing to improve."
                : "Keep practicing! You'll get better with time."}
          </h3>
          <p className="text-gray-600">
            {percentage >= 70
              ? "You've demonstrated excellent knowledge of this topic. Ready for the next challenge?"
              : "Don't worry if you didn't get all the answers right. Learning takes practice!"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
          <RotateCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild className="bg-fuchsia-600 hover:bg-fuchsia-700 flex items-center gap-2">
          <Link href={`/lessons/${lessonId}`}>Continue Learning</Link>
        </Button>
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
