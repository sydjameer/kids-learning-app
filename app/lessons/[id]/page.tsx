"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star, VolumeIcon as VolumeUp, Check, RotateCw, BookOpen, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/contexts/progress-context"
import { useSound } from "@/contexts/sound-context"
import { getLessonById, fetchLessonItems } from "@/lib/api-client"
import { OverallProgress } from "@/components/overall-progress"
import { LanguageCard } from "@/components/language-card"
import type { ImageItem } from "@/types"

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const lessonId = Number.parseInt(params.id)
  const [lesson, setLesson] = useState<any>(null)
  const [lessonItems, setLessonItems] = useState<ImageItem[]>([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [activeLanguage, setActiveLanguage] = useState<string>("english")
  const [mode, setMode] = useState<"learn" | "practice">("learn")
  const [practiceCompleted, setPracticeCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [stars, setStars] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { markItemCompleted, getItemStars, isItemCompleted, isLessonQuizCompleted, getLessonQuizScore } = useProgress()
  const { playClick, playCorrect, playIncorrect, playSuccess } = useSound()

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

        // Fetch lesson items
        const items = await fetchLessonItems(lessonId)
        if (!items || items.length === 0) {
          throw new Error(`No items found for lesson ${lessonId}`)
        }

        // Log the items to debug
        console.log("Lesson items:", items)

        // Validate item structure
        items.forEach((item, index) => {
          if (!item.names || !item.names.english || !item.names.malay || !item.names.arabic) {
            console.error(`Item at index ${index} has invalid structure:`, item)
            throw new Error(`Item data is incomplete or in wrong format`)
          }
        })

        setLessonItems(items)

        // Load quiz score if available
        const score = getLessonQuizScore(lessonId)
        setQuizScore(score)
      } catch (error) {
        console.error("Failed to load lesson data:", error)
        setError(`Failed to load lesson data: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [lessonId, getLessonQuizScore])

  // Load existing stars if item was previously completed
  useEffect(() => {
    if (lessonItems.length > 0 && currentItemIndex < lessonItems.length) {
      const currentItem = lessonItems[currentItemIndex]
      const existingStars = getItemStars(currentItem.id)
      if (existingStars > 0) {
        setStars(existingStars)
      }
    }
  }, [lessonItems, currentItemIndex, getItemStars])

  // Safely get the current item with null checks
  const currentItem =
    lessonItems.length > 0 && currentItemIndex < lessonItems.length ? lessonItems[currentItemIndex] : null

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
          <div className="space-y-4">
            <Button onClick={() => window.location.reload()} className="bg-fuchsia-600 hover:bg-fuchsia-700">
              Try Again
            </Button>
            <div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/">Go back to lessons</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! No items found</h1>
          <p className="mb-8">This lesson doesn't have any items to learn.</p>
          <Button asChild>
            <Link href="/">Go back to lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Ensure the current item has all required properties
  if (!currentItem.names || !currentItem.names.english || !currentItem.names.malay || !currentItem.names.arabic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Invalid item data</h1>
          <p className="mb-8">The item data is incomplete or in the wrong format.</p>
          <Button asChild>
            <Link href="/">Go back to lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleLanguageClick = (language: string) => {
    if (playClick) playClick()
    setActiveLanguage(language)
    // Simulate pronunciation by speaking the word (in a real app, you'd use audio files)
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(currentItem.names[language as keyof typeof currentItem.names])
      window.speechSynthesis.speak(utterance)
    }
  }

  const handlePronounce = () => {
    if (playClick) playClick()
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        currentItem.names[activeLanguage as keyof typeof currentItem.names],
      )
      window.speechSynthesis.speak(utterance)
    }
  }

  const startPractice = () => {
    if (playClick) playClick()
    setMode("practice")
    setSelectedAnswer(null)
    setIsCorrect(null)
    setPracticeCompleted(false)
  }

  const handleAnswerSelect = (language: string) => {
    if (playClick) playClick()
    setSelectedAnswer(language)
    const correct = language === activeLanguage
    setIsCorrect(correct)

    if (correct) {
      // Play correct sound
      if (playCorrect) playCorrect()

      // Add a star for correct answer
      setStars((prev) => prev + 1)

      // Mark as completed after successful practice
      setTimeout(() => {
        setPracticeCompleted(true)
        markItemCompleted(currentItem.id, stars + 1)
        if (playSuccess) playSuccess()
      }, 1000)
    } else {
      // Play incorrect sound
      if (playIncorrect) playIncorrect()
    }
  }

  const resetPractice = () => {
    if (playClick) playClick()
    // Choose a random language for the next practice
    const languages = ["english", "malay", "arabic"]
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)]
    setActiveLanguage(randomLanguage)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const nextItem = () => {
    if (playClick) playClick()
    if (currentItemIndex < lessonItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
      setMode("learn")
      setSelectedAnswer(null)
      setIsCorrect(null)
      setPracticeCompleted(false)
    } else {
      // End of lesson
      router.push("/")
    }
  }

  const goToQuiz = () => {
    if (playClick) playClick()
    router.push(`/lessons/${lessonId}/quiz`)
  }

  const isQuizCompleted = isLessonQuizCompleted(lessonId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-fuchsia-600">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to lessons</span>
          </Button>
          <h1 className="text-3xl font-bold text-fuchsia-600">
            {lesson.title}: {currentItemIndex + 1}/{lessonItems.length}
          </h1>
          <div className="flex items-center">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </header>

        <main>
          <Card className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg border-2 border-fuchsia-200">
            {mode === "learn" ? (
              <>
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-fuchsia-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={currentItem.image || "/placeholder.svg"}
                      alt={currentItem.names.english}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </div>

                <div className="grid gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
                    Learn how to say "{currentItem.names.english}" in different languages
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LanguageCard
                      language="English"
                      name={currentItem.names.english}
                      flag="🇬🇧"
                      color="text-blue-600"
                      bgColor="bg-blue-100"
                      onClick={() => handleLanguageClick("english")}
                      active={activeLanguage === "english"}
                    />
                    <LanguageCard
                      language="Malay"
                      name={currentItem.names.malay}
                      flag="🇲🇾"
                      color="text-green-600"
                      bgColor="bg-green-100"
                      onClick={() => handleLanguageClick("malay")}
                      active={activeLanguage === "malay"}
                    />
                    <LanguageCard
                      language="Arabic"
                      name={currentItem.names.arabic}
                      flag="🇸🇦"
                      color="text-purple-600"
                      bgColor="bg-purple-100"
                      onClick={() => handleLanguageClick("arabic")}
                      active={activeLanguage === "arabic"}
                    />
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button onClick={handlePronounce} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600">
                      <VolumeUp className="h-5 w-5" />
                      Pronounce
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={startPractice} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-lg px-6">
                    Practice Now
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-600 mb-2">Practice Time!</h2>
                  <p className="text-xl text-gray-700">
                    {practiceCompleted
                      ? "Great job! You've completed the practice."
                      : `Which language is this word in?`}
                  </p>
                </div>

                {!practiceCompleted ? (
                  <>
                    <div className="flex justify-center mb-8">
                      <motion.div
                        className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-fuchsia-200"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={currentItem.image || "/placeholder.svg"}
                          alt={currentItem.names.english}
                          fill
                          className="object-contain"
                        />
                      </motion.div>
                    </div>

                    <div className="text-center mb-8">
                      <motion.h3
                        className="text-3xl font-bold mb-4"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {currentItem.names[activeLanguage as keyof typeof currentItem.names]}
                      </motion.h3>
                      <Button onClick={handlePronounce} variant="outline" size="sm" className="flex items-center gap-2">
                        <VolumeUp className="h-4 w-4" />
                        Listen
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className={`p-6 text-lg w-full ${
                            selectedAnswer === "english"
                              ? isCorrect
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-red-100 border-red-500 text-red-700"
                              : ""
                          }`}
                          onClick={() => handleAnswerSelect("english")}
                          disabled={!!selectedAnswer}
                        >
                          <div className="flex items-center gap-2">
                            <span>🇬🇧</span>
                            <span>English</span>
                          </div>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className={`p-6 text-lg w-full ${
                            selectedAnswer === "malay"
                              ? isCorrect
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-red-100 border-red-500 text-red-700"
                              : ""
                          }`}
                          onClick={() => handleAnswerSelect("malay")}
                          disabled={!!selectedAnswer}
                        >
                          <div className="flex items-center gap-2">
                            <span>🇲🇾</span>
                            <span>Malay</span>
                          </div>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className={`p-6 text-lg w-full ${
                            selectedAnswer === "arabic"
                              ? isCorrect
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-red-100 border-red-500 text-red-700"
                              : ""
                          }`}
                          onClick={() => handleAnswerSelect("arabic")}
                          disabled={!!selectedAnswer}
                        >
                          <div className="flex items-center gap-2">
                            <span>🇸🇦</span>
                            <span>Arabic</span>
                          </div>
                        </Button>
                      </motion.div>
                    </div>

                    {selectedAnswer && !isCorrect && (
                      <div className="text-center mb-6">
                        <p className="text-red-600 mb-4">Try again!</p>
                        <Button onClick={resetPractice} className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4" />
                          Try Another
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <motion.div
                      className="bg-green-100 text-green-700 p-6 rounded-xl mb-8"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-xl font-bold">Congratulations!</p>
                      <p>You've successfully learned this word in multiple languages!</p>
                    </motion.div>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setMode("learn")} variant="outline">
                        Learn Again
                      </Button>
                      <Button onClick={nextItem} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                        {currentItemIndex < lessonItems.length - 1 ? "Next Item" : "Finish Lesson"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          <div className="max-w-3xl mx-auto mt-8 text-center">
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-fuchsia-200">
              <h3 className="text-xl font-bold text-fuchsia-600 mb-2">Ready to test your knowledge?</h3>
              <p className="text-gray-600 mb-4">
                Take a quiz to see how well you've learned the {lesson.title.toLowerCase()} in different languages!
              </p>

              {isQuizCompleted ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <p className="text-gray-700 mr-2">Your quiz score:</p>
                    <div className="flex">
                      {[...Array(quizScore)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <Button onClick={goToQuiz} className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              ) : (
                <Button onClick={goToQuiz} className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              )}
            </div>
          </div>
        </main>

        <footer className="text-center mt-12">
          <div className="flex justify-center space-x-4 mb-4">
            <Link href="/support" className="text-amber-600 hover:text-amber-700">
              Support Us
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/" className="text-fuchsia-600 hover:text-fuchsia-700">
              Home
            </Link>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} KidLearn - Making learning fun!</p>
        </footer>
      </div>
    </div>
  )
}
