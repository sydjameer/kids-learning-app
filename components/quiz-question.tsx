"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useSound } from "@/contexts/sound-context"
import type { QuizQuestion } from "@/types"

interface QuizQuestionProps {
  question: QuizQuestion
  onAnswer: (isCorrect: boolean) => void
  questionNumber: number
  totalQuestions: number
}

export function QuizQuestionComponent({ question, onAnswer, questionNumber, totalQuestions }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const { playClick, playCorrect, playIncorrect } = useSound()

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return // Prevent changing answer after selection

    if (playClick) playClick()
    setSelectedOption(option)

    const isCorrect = option === question.correctAnswer

    if (isCorrect) {
      if (playCorrect) playCorrect()
    } else {
      if (playIncorrect) playIncorrect()
    }

    setShowFeedback(true)

    // Delay before moving to next question
    setTimeout(() => {
      onAnswer(isCorrect)
      setSelectedOption(null)
      setShowFeedback(false)
    }, 1500)
  }

  const isCorrect = selectedOption === question.correctAnswer
  const isIncorrect = selectedOption !== null && !isCorrect

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="mb-4 text-center">
        <div className="text-sm text-gray-500 mb-1">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h3 className="text-2xl font-bold text-fuchsia-600 mb-4">{question.question}</h3>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-fuchsia-200">
          <Image src={question.image || "/placeholder.svg"} alt={question.question} fill className="object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {question.options.map((option) => (
          <motion.div key={option} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className={`w-full p-4 text-lg h-auto ${
                selectedOption === option
                  ? isCorrect
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-red-100 border-red-500 text-red-700"
                  : "hover:bg-fuchsia-50 hover:border-fuchsia-300"
              }`}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center ${
            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrect ? (
            <div className="flex items-center justify-center">
              <Check className="mr-2" />
              <span>Correct! Great job!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <X className="mr-2" />
              <span>
                Oops! The correct answer is <strong>{question.correctAnswer}</strong>
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
