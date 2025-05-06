"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star, VolumeIcon as VolumeUp, Check, RotateCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/contexts/progress-context"
import { getItemById } from "@/lib/api-client"
import { OverallProgress } from "@/components/overall-progress"
import { LanguageCard } from "@/components/language-card"

export default function LearnPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const itemId = Number.parseInt(params.id)
  const [stars, setStars] = useState(0)
  const [activeLanguage, setActiveLanguage] = useState<string>("english")
  const [mode, setMode] = useState<"learn" | "practice">("learn")
  const [practiceCompleted, setPracticeCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const { markItemCompleted, getItemStars, isItemCompleted } = useProgress()

  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    async function loadItem() {
      try {
        // We need to pass both the lesson ID and item ID
        // For now, we'll use a workaround since we don't have the lesson ID
        const fetchedItem = await getItemById(1, itemId) // Using lesson ID 1 as fallback
        setItem(fetchedItem)
      } catch (error) {
        console.error("Failed to load item:", error)
      }
    }

    loadItem()
  }, [itemId])

  useEffect(() => {
    // Load existing stars if item was previously completed
    if (item) {
      const existingStars = getItemStars(itemId)
      if (existingStars > 0) {
        setStars(existingStars)
      }
    }
  }, [itemId, getItemStars, item])

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Item not found</h1>
          <p className="mb-8">We couldn't find the item you're looking for.</p>
          <Button asChild>
            <Link href="/">Go back to items</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleLanguageClick = (language: string) => {
    setActiveLanguage(language)
    // Simulate pronunciation by speaking the word (in a real app, you'd use audio files)
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(item.names[language as keyof typeof item.names])
      window.speechSynthesis.speak(utterance)
    }
  }

  const handlePronounce = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(item.names[activeLanguage as keyof typeof item.names])
      window.speechSynthesis.speak(utterance)
    }
  }

  const startPractice = () => {
    setMode("practice")
    setSelectedAnswer(null)
    setIsCorrect(null)
    setPracticeCompleted(false)
  }

  const handleAnswerSelect = (language: string) => {
    setSelectedAnswer(language)
    const correct = language === activeLanguage
    setIsCorrect(correct)

    if (correct) {
      // Add a star for correct answer
      setStars((prev) => prev + 1)

      // Mark as completed after successful practice
      setTimeout(() => {
        setPracticeCompleted(true)
        markItemCompleted(itemId, stars + 1)
      }, 1000)
    }
  }

  const resetPractice = () => {
    // Choose a random language for the next practice
    const languages = ["english", "malay", "arabic"]
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)]
    setActiveLanguage(randomLanguage)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-purple-600">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to items</span>
          </Button>
          <h1 className="text-3xl font-bold text-purple-600">Learn: {item.names.english}</h1>
          <div className="flex items-center">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </header>

        <main>
          <Card className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg border-2 border-purple-200">
            {mode === "learn" ? (
              <>
                <div className="flex justify-center mb-8">
                  <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-purple-200">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.names.english}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="grid gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-center text-pink-500 mb-2">
                    Learn how to say "{item.names.english}" in different languages
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LanguageCard
                      language="English"
                      name={item.names.english}
                      flag="🇬🇧"
                      color="text-blue-600"
                      bgColor="bg-blue-100"
                      onClick={() => handleLanguageClick("english")}
                      active={activeLanguage === "english"}
                    />
                    <LanguageCard
                      language="Malay"
                      name={item.names.malay}
                      flag="🇲🇾"
                      color="text-green-600"
                      bgColor="bg-green-100"
                      onClick={() => handleLanguageClick("malay")}
                      active={activeLanguage === "malay"}
                    />
                    <LanguageCard
                      language="Arabic"
                      name={item.names.arabic}
                      flag="🇸🇦"
                      color="text-purple-600"
                      bgColor="bg-purple-100"
                      onClick={() => handleLanguageClick("arabic")}
                      active={activeLanguage === "arabic"}
                    />
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button onClick={handlePronounce} className="flex items-center gap-2">
                      <VolumeUp className="h-5 w-5" />
                      Pronounce
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={startPractice} className="bg-purple-600 hover:bg-purple-700">
                    Practice Now
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-500 mb-2">Practice Time!</h2>
                  <p className="text-xl text-gray-700">
                    {practiceCompleted
                      ? "Great job! You've completed the practice."
                      : `Which language is this word in?`}
                  </p>
                </div>

                {!practiceCompleted ? (
                  <>
                    <div className="flex justify-center mb-8">
                      <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-purple-200">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.names.english}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-4">
                        {item.names[activeLanguage as keyof typeof item.names]}
                      </h3>
                      <Button onClick={handlePronounce} variant="outline" size="sm" className="flex items-center gap-2">
                        <VolumeUp className="h-4 w-4" />
                        Listen
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Button
                        variant="outline"
                        className={`p-6 text-lg ${
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
                      <Button
                        variant="outline"
                        className={`p-6 text-lg ${
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
                      <Button
                        variant="outline"
                        className={`p-6 text-lg ${
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
                    <div className="bg-green-100 text-green-700 p-6 rounded-xl mb-8">
                      <Check className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-xl font-bold">Congratulations!</p>
                      <p>You've successfully learned this word in multiple languages!</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setMode("learn")} variant="outline">
                        Learn Again
                      </Button>
                      <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link href="/">Back to Items</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}
