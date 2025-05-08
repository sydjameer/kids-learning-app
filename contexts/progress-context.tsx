"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { LearningProgress } from "@/types"
import { fetchUserProgress, updateItemProgress, updateLessonProgress, updateQuizProgress } from "@/lib/api-client"

interface ProgressContextType {
  progress: LearningProgress
  totalItems: number
  completedItems: number
  totalStars: number
  overallCompletionPercentage: number
  markItemCompleted: (itemId: number, stars: number) => void
  isItemCompleted: (itemId: number) => boolean
  getItemStars: (itemId: number) => number
  markLessonCompleted: (lessonId: number, stars: number, categoryId: string) => void
  isLessonCompleted: (lessonId: number) => boolean
  getLessonStars: (lessonId: number) => number
  markLessonQuizCompleted: (lessonId: number, score: number) => void
  isLessonQuizCompleted: (lessonId: number) => boolean
  getLessonQuizScore: (lessonId: number) => number
  getCategoryCompletionPercentage: (categoryId: string) => number
  isLoading: boolean
  error: string | null
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user progress from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Load user progress from API
        const userProgress = await fetchUserProgress()

        // Convert API progress format to our app's format
        const formattedProgress: LearningProgress = {}

        // Process item progress
        Object.entries(userProgress).forEach(([key, value]: [string, any]) => {
          if (key.startsWith("item_")) {
            const itemId = Number.parseInt(key.replace("item_", ""))
            formattedProgress[itemId] = {
              completed: value.completed,
              stars: value.stars,
            }
          } else if (key.startsWith("lesson_")) {
            const lessonId = Number.parseInt(key.replace("lesson_", ""))
            formattedProgress[`lesson_${lessonId}`] = {
              completed: value.completed,
              stars: value.stars,
              categoryId: value.categoryId,
            }
          } else if (key.startsWith("quiz_")) {
            const lessonId = Number.parseInt(key.replace("quiz_", ""))
            formattedProgress[`lesson_quiz_${lessonId}`] = {
              completed: true,
              quizCompleted: true,
              quizScore: value.score,
            }
          }
        })

        setProgress(formattedProgress)

        // Set total items count based on the API response
        if (userProgress.totalItems) {
          setTotalItems(userProgress.totalItems)
        }
      } catch (error) {
        console.error("Failed to load progress data:", error)
        setError("Failed to load progress data. Please try again later.")

        // Fall back to localStorage if API fails
        const savedProgress = localStorage.getItem("learningProgress")
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress))
        }
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  // Save progress to localStorage as backup
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("learningProgress", JSON.stringify(progress))
    }
  }, [progress, isLoaded])

  // Count completed items (only count actual items, not lessons or quizzes)
  const completedItems = Object.entries(progress).filter(
    ([key, item]) => !key.startsWith("lesson_") && item.completed,
  ).length

  // Calculate total stars
  const totalStars = Object.values(progress).reduce((total, item) => total + (item.stars || 0), 0)

  // Calculate overall completion percentage with a more accurate approach
  // Only consider actual items for the percentage calculation
  const calculateOverallPercentage = () => {
    // If no total items, return 0
    if (totalItems <= 0) return 0

    // Calculate percentage based on completed items vs total items
    const percentage = Math.round((completedItems / totalItems) * 100)

    // Ensure percentage is between 0 and 100
    return Math.min(Math.max(percentage, 0), 100)
  }

  const overallCompletionPercentage = calculateOverallPercentage()

  const markItemCompleted = async (itemId: number, stars: number) => {
    try {
      // Update on the server
      await updateItemProgress(itemId, true, stars)

      // Update local state
      setProgress((prev) => ({
        ...prev,
        [itemId]: {
          completed: true,
          stars: Math.max(stars, prev[itemId]?.stars || 0),
        },
      }))
    } catch (error) {
      console.error("Failed to update item progress:", error)
      // Still update local state even if API fails
      setProgress((prev) => ({
        ...prev,
        [itemId]: {
          completed: true,
          stars: Math.max(stars, prev[itemId]?.stars || 0),
        },
      }))
    }
  }

  const isItemCompleted = (itemId: number): boolean => {
    return !!progress[itemId]?.completed
  }

  const getItemStars = (itemId: number): number => {
    return progress[itemId]?.stars || 0
  }

  const markLessonCompleted = async (lessonId: number, stars: number, categoryId: string) => {
    const key = `lesson_${lessonId}`
    try {
      // Update on the server
      await updateLessonProgress(lessonId, true, stars)

      // Update local state
      setProgress((prev) => ({
        ...prev,
        [key]: {
          completed: true,
          stars: Math.max(stars, prev[key]?.stars || 0),
          categoryId,
        },
      }))
    } catch (error) {
      console.error("Failed to update lesson progress:", error)
      // Still update local state even if API fails
      setProgress((prev) => ({
        ...prev,
        [key]: {
          completed: true,
          stars: Math.max(stars, prev[key]?.stars || 0),
          categoryId,
        },
      }))
    }
  }

  const isLessonCompleted = (lessonId: number): boolean => {
    const key = `lesson_${lessonId}`
    return !!progress[key]?.completed
  }

  const getLessonStars = (lessonId: number): number => {
    const key = `lesson_${lessonId}`
    return progress[key]?.stars || 0
  }

  const markLessonQuizCompleted = async (lessonId: number, score: number) => {
    const key = `lesson_quiz_${lessonId}`
    try {
      // Update on the server
      await updateQuizProgress(lessonId, true, score)

      // Update local state
      setProgress((prev) => ({
        ...prev,
        [key]: {
          completed: true,
          quizCompleted: true,
          quizScore: Math.max(score, prev[key]?.quizScore || 0),
        },
      }))
    } catch (error) {
      console.error("Failed to update quiz progress:", error)
      // Still update local state even if API fails
      setProgress((prev) => ({
        ...prev,
        [key]: {
          completed: true,
          quizCompleted: true,
          quizScore: Math.max(score, prev[key]?.quizScore || 0),
        },
      }))
    }
  }

  const isLessonQuizCompleted = (lessonId: number): boolean => {
    const key = `lesson_quiz_${lessonId}`
    return !!progress[key]?.quizCompleted
  }

  const getLessonQuizScore = (lessonId: number): number => {
    const key = `lesson_quiz_${lessonId}`
    return progress[key]?.quizScore || 0
  }

  const getCategoryCompletionPercentage = (categoryId: string): number => {
    const categoryLessons = Object.entries(progress).filter(
      ([key, value]) => key.startsWith("lesson_") && value.categoryId === categoryId,
    )

    if (categoryLessons.length === 0) return 0

    const completedLessons = categoryLessons.filter(([_, value]) => value.completed).length
    return Math.round((completedLessons / categoryLessons.length) * 100) || 0
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        totalItems,
        completedItems,
        totalStars,
        overallCompletionPercentage,
        markItemCompleted,
        isItemCompleted,
        getItemStars,
        markLessonCompleted,
        isLessonCompleted,
        getLessonStars,
        markLessonQuizCompleted,
        isLessonQuizCompleted,
        getLessonQuizScore,
        getCategoryCompletionPercentage,
        isLoading,
        error,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
