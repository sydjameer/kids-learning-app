"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { LearningProgress } from "@/types"
import { fetchLearningItems, fetchLessons } from "@/lib/data"

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
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  // Load total items count
  useEffect(() => {
    const loadItems = async () => {
      const items = await fetchLearningItems()
      const lessons = await fetchLessons()

      // Count total items across all lessons
      let totalItemCount = 0
      lessons.forEach((lesson) => {
        totalItemCount += lesson.items.length
      })

      setTotalItems(totalItemCount)
    }
    loadItems()
  }, [])

  // Load progress from localStorage on initial render
  useEffect(() => {
    const savedProgress = localStorage.getItem("learningProgress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
    setIsLoaded(true)
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("learningProgress", JSON.stringify(progress))
    }
  }, [progress, isLoaded])

  const completedItems = Object.values(progress).filter((item) => item.completed).length
  const totalStars = Object.values(progress).reduce((total, item) => total + (item.stars || 0), 0)
  const overallCompletionPercentage = Math.round((completedItems / (totalItems || 1)) * 100) || 0

  const markItemCompleted = (itemId: number, stars: number) => {
    setProgress((prev) => ({
      ...prev,
      [itemId]: {
        completed: true,
        stars: Math.max(stars, prev[itemId]?.stars || 0),
      },
    }))
  }

  const isItemCompleted = (itemId: number): boolean => {
    return !!progress[itemId]?.completed
  }

  const getItemStars = (itemId: number): number => {
    return progress[itemId]?.stars || 0
  }

  const markLessonCompleted = (lessonId: number, stars: number, categoryId: string) => {
    const key = `lesson_${lessonId}`
    setProgress((prev) => ({
      ...prev,
      [key]: {
        completed: true,
        stars: Math.max(stars, prev[key]?.stars || 0),
        categoryId,
      },
    }))
  }

  const isLessonCompleted = (lessonId: number): boolean => {
    const key = `lesson_${lessonId}`
    return !!progress[key]?.completed
  }

  const getLessonStars = (lessonId: number): number => {
    const key = `lesson_${lessonId}`
    return progress[key]?.stars || 0
  }

  const markLessonQuizCompleted = (lessonId: number, score: number) => {
    const key = `lesson_quiz_${lessonId}`
    setProgress((prev) => ({
      ...prev,
      [key]: {
        completed: true,
        quizCompleted: true,
        quizScore: Math.max(score, prev[key]?.quizScore || 0),
      },
    }))
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
