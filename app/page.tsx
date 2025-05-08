"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ProgressSummary } from "@/components/progress-summary"
import { OverallProgress } from "@/components/overall-progress"
import { fetchLessons } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { usePremium } from "@/contexts/premium-context"
import { useSound } from "@/contexts/sound-context"
import { useAuth } from "@/contexts/auth-context"
import { Coffee, Star, AlertCircle } from "lucide-react"
import type { Lesson } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { AuthBanner } from "@/components/auth-banner"
import { AuthModal } from "@/components/auth-modal"
import { UserMenu } from "@/components/user-menu"

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { setShowSupportModal } = usePremium()
  const { playClick } = useSound()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        // Load data with error handling
        const lessonsData = await fetchLessons()
        setLessons(lessonsData)
      } catch (error) {
        console.error("Failed to load data:", error)
        setError("Failed to load lessons. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSupportClick = () => {
    if (playClick) playClick()
    setShowSupportModal(true)
  }

  const handleSignInClick = () => {
    if (playClick) playClick()
    setShowAuthModal(true)
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-fuchsia-600 hover:bg-fuchsia-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-white">
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <UserMenu onSignInClick={handleSignInClick} />
        </div>

        <motion.header
          className="mb-8 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-fuchsia-600 mb-2">MIT Learn</h1>
          <p className="text-2xl text-pink-600">Learn words in multiple languages!</p>
        </motion.header>

        <main>
          <AuthBanner onSignInClick={handleSignInClick} />

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
                  <Link href={`/lessons/${lesson.id}`}>
                    <Card
                      className={`h-full overflow-hidden cursor-pointer border-2 ${
                        index % 2 === 0 ? "bg-cyan-100" : "bg-amber-100"
                      } hover:shadow-xl transition-all duration-300`}
                      style={{ fontFamily: "ChildsPlay, sans-serif" }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="relative rounded-full w-20 h-20 flex items-center justify-center overflow-hidden"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Image
                              src={lesson.image || "/placeholder.svg"}
                              alt={lesson.title}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`text-2xl font-bold ${
                                  index % 2 === 0 ? "text-cyan-600" : "text-amber-600"
                                } mb-2`}
                              >
                                {lesson.title}
                              </h3>
                            </div>
                            <p className="text-gray-700 mb-2">{lesson.description}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              {/* Display the actual number of learning items */}
                              {lesson.items && lesson.items.length > 0 ? (
                                <div className="font-medium">
                                  {lesson.items.length} learning {lesson.items.length === 1 ? "item" : "items"}
                                </div>
                              ) : (
                                <div className="font-medium">Learning items</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSupportClick}
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-8 py-4 rounded-full text-xl shadow-lg"
                style={{ fontFamily: "ChildsPlay, sans-serif" }}
              >
                <Coffee className="mr-2 h-6 w-6" />
                Support MIT Learn
              </Button>
              <p className="mt-3 text-amber-600 font-medium">
                MIT Learn is completely free! Consider supporting our mission.
              </p>
            </motion.div>
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
                  <div className="bg-white px-4 py-2 rounded-full flex items-center shadow-md">
                    <span className="text-xl mr-2">🇸🇬</span>
                    <span className="font-bold text-gray-700">Singapore</span>
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
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} MIT Learn - Making learning fun!</p>
          <div className="flex justify-center items-center mt-2">
            <span className="text-sm mr-2">🇸🇬</span>
            <span className="text-xs text-gray-500">Made with ❤️ in Singapore</span>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
