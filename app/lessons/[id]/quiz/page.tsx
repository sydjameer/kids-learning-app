"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/contexts/progress-context"
import { getLessonById, fetchQuizByLessonId } from "@/lib/api-client"
import { OverallProgress } from "@/components/overall-progress"
import { QuizQuestionComponent } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"
import type { Quiz } from "@/types"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const lessonId = Number.parseInt(params.id)
  const [lesson, setLesson] = useState<any>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [stars, setStars] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { markLessonQuizCompleted, getLessonQuizScore } = useProgress()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        // Fetch lesson data
        const lessonData = await getLessonById(lessonId)
        if (!lessonData) {
          throw new Error(`Lesson with ID ${lessonId} not found`)
        }
        setLesson(lessonData)

        // All lessons are now free, no need to check for premium

        // Fetch quiz data
        const quizData = await fetchQuizByLessonId(lessonId)
        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
          throw new Error(`No quiz found for lesson ${lessonId}`)
        }

        console.log("Quiz data:", quizData)
        setQuiz(quizData)

        // Load existing quiz score if available
        const existingScore = getLessonQuizScore(lessonId)
        if (existingScore > 0) {
          setStars(existingScore)
        }
      } catch (error) {
        console.error("Failed to load quiz data:", error)
        setError(`Failed to load quiz data: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [lessonId, getLessonQuizScore, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="text-3xl font-bold text-fuchsia-600"
          style={{ fontFamily: "ChildsPlay, sans-serif" }}
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong</h1>
          <p className="mb-8">{error}</p>
          <Button asChild>
            <Link href="/">Go back to lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!lesson || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Quiz not found</h1>
          <p className="mb-8">We couldn't find the quiz you're looking for.</p>
          <Button asChild>
            <Link href="/">Go back to lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
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
          <h1 className="text-3xl font-bold text-fuchsia-600">{quiz.title}</h1>
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
                <p className="text-gray-600 mb-8">{quiz.description}</p>

                <QuizQuestionComponent
                  question={quiz.questions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={quiz.questions.length}
                />
              </div>
            ) : (
              <QuizResults
                score={score}
                totalQuestions={quiz.questions.length}
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
