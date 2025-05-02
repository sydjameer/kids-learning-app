"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ProgressSummary } from "@/components/progress-summary"
import { OverallProgress } from "@/components/overall-progress"
import { fetchLessons } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { usePremium } from "@/contexts/premium-context"
import { useSound } from "@/contexts/sound-context"
import { Crown, Lock, Star } from "lucide-react"
import type { Lesson } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const { isPremium, setShowPremiumModal } = usePremium()
  const { playClick } = useSound()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Load data with error handling
        const lessonsData = await fetchLessons()
        setLessons(lessonsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLessonClick = (lesson: Lesson) => {
    if (playClick) playClick()
    if (lesson.isPremium && !isPremium) {
      setShowPremiumModal(true)
    } else {
      // Navigate to lesson page
    }
  }

  const handleGetPremium = () => {
    if (playClick) playClick()
    setShowPremiumModal(true)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <motion.header
          className="mb-8 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-fuchsia-600 mb-2">KidLearn</h1>
          <p className="text-2xl text-pink-600">Learn words in multiple languages!</p>
        </motion.header>

        <main>
          <section className="mb-8">
            <ProgressSummary />
          </section>

          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">Choose a Lesson</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={lesson.isPremium && !isPremium ? "#" : `/lessons/${lesson.id}`}>
                    <Card
                      className={`h-full overflow-hidden cursor-pointer border-2 ${
                        lesson.isPremium ? "bg-amber-100" : "bg-cyan-100"
                      } hover:shadow-xl transition-all duration-300`}
                      onClick={() => {
                        if (lesson.isPremium && !isPremium) {
                          handleLessonClick(lesson)
                        }
                      }}
                      style={{ fontFamily: "ChildsPlay, sans-serif" }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className={`relative rounded-full w-20 h-20 flex items-center justify-center overflow-hidden ${
                              lesson.isPremium && !isPremium ? "opacity-70" : ""
                            }`}
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Image
                              src={lesson.image || "/placeholder.svg"}
                              alt={lesson.title}
                              fill
                              className="object-cover"
                            />
                            {lesson.isPremium && !isPremium && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Lock className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`text-2xl font-bold ${
                                  lesson.isPremium ? "text-amber-600" : "text-cyan-600"
                                } mb-2`}
                              >
                                {lesson.title}
                              </h3>
                              {lesson.isPremium && !isPremium && (
                                <div className="bg-amber-400 rounded-full p-1">
                                  <Lock className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{lesson.description}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <div className="flex space-x-1 mr-2">
                                <span className="font-bold">{lesson.items.length}</span>
                                <span>items</span>
                              </div>
                              <div className="flex space-x-1">
                                <span>•</span>
                                <span>3 languages</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {!isPremium && (
              <motion.div
                className="mt-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleGetPremium}
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-8 py-4 rounded-full text-xl shadow-lg"
                  style={{ fontFamily: "ChildsPlay, sans-serif" }}
                >
                  <Crown className="mr-2 h-6 w-6" />
                  Unlock All Premium Lessons for $9.99
                </Button>
                <p className="mt-3 text-pink-600 font-medium">Get access to 4 more exciting lessons!</p>
              </motion.div>
            )}
          </motion.section>

          <motion.section
            className="bg-fuchsia-100 rounded-2xl p-6 mb-8 border-2 border-fuchsia-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: "ChildsPlay, sans-serif" }}
          >
            <h2 className="text-2xl font-bold text-fuchsia-600 mb-4">Parent's Corner</h2>
            <p className="text-gray-700 mb-4">Our app helps children learn words in multiple languages:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Each item is taught in English, Malay, and Arabic</li>
              <li>Interactive learning with visual and audio cues</li>
              <li>Practice mode to reinforce learning</li>
              <li>Progress tracking to celebrate achievements</li>
              <li>Fun and engaging design to keep children interested</li>
            </ul>
          </motion.section>

          <motion.section
            className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-8 border-2 border-pink-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-pink-600 mb-2">Languages Included</h2>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="bg-white px-4 py-2 rounded-full flex items-center shadow-md">
                    <span className="text-xl mr-2">🇬🇧</span>
                    <span className="font-bold text-gray-700">English</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full flex items-center shadow-md">
                    <span className="text-xl mr-2">🇲🇾</span>
                    <span className="font-bold text-gray-700">Malay</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full flex items-center shadow-md">
                    <span className="text-xl mr-2">🇸🇦</span>
                    <span className="font-bold text-gray-700">Arabic</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-purple-600 font-bold mt-2">Loved by kids and parents!</p>
              </div>
            </div>
          </motion.section>
        </main>

        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>© {new Date().getFullYear()} KidLearn - Making learning fun!</p>
        </footer>
      </div>
    </div>
  )
}
