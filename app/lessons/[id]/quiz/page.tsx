"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/contexts/progress-context"
import { usePremium } from "@/contexts/premium-context"
import { getLessonById } from "@/lib/data"
import { OverallProgress } from "@/components/overall-progress"
import { QuizQuestionComponent } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const lessonId = Number.parseInt(params.id)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [stars, setStars] = useState(0)
  const { markLessonQuizCompleted, getLessonQuizScore } = useProgress()
  const { isPremium, setShowPremiumModal } = usePremium()

  const lesson = getLessonById(lessonId)

  useEffect(() => {
    // Check if lesson is premium and user doesn't have premium access
    if (lesson?.isPremium && !isPremium) {
      setShowPremiumModal(true)
      router.push("/")
    }

    // Load existing quiz score if available
    if (lesson) {
      const existingScore = getLessonQuizScore(lessonId)
      if (existingScore > 0) {
        setStars(existingScore)
      }
    }
  }, [lessonId, getLessonQuizScore, lesson, isPremium, setShowPremiumModal, router])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Lesson not found</h1>
          <p className="mb-8">We couldn't find the lesson you're looking for.</p>
          <Button asChild>
            <Link href="/">Go back to lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  // If lesson is premium and user doesn't have premium access
  if (lesson.isPremium && !isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-amber-100 rounded-2xl p-8 border-4 border-amber-300 shadow-xl">
              <h1 className="text-3xl font-bold text-amber-600 mb-4">Premium Lesson</h1>
              <p className="text-lg text-gray-700 mb-6">
                This is a premium lesson. Unlock all premium content to access it!
              </p>
              <Button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-3 rounded-full text-lg shadow-lg"
              >
                Unlock Premium for $9.99
              </Button>
              <div className="mt-6">
                <Link href="/" className="text-fuchsia-600 hover:underline">
                  Back to lessons
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < lesson.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      const finalScore = isCorrect ? score + 1 : score
      setScore(finalScore)
      setQuizCompleted(true)
      markLessonQuizCompleted(lessonId, finalScore)
    }
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/lessons/${lessonId}`)}
            className="text-fuchsia-600"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to lesson</span>
          </Button>
          <h1 className="text-3xl font-bold text-fuchsia-600">{lesson.quiz.title}</h1>
          <div className="flex items-center">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </header>

        <main>
          <Card className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg border-2 border-fuchsia-200">
            {!quizCompleted ? (
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-8">{lesson.quiz.description}</p>

                <QuizQuestionComponent
                  question={lesson.quiz.questions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={lesson.quiz.questions.length}
                />
              </div>
            ) : (
              <QuizResults
                score={score}
                totalQuestions={lesson.quiz.questions.length}
                onRetry={handleRetry}
                lessonId={lessonId}
              />
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}
