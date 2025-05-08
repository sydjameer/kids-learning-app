import type { Category, Lesson, ImageItem, Quiz, QuizQuestion } from "@/types"

// Base API URL - replace with your Django API URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// Refresh token function
const refreshToken = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false

  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) return false

    const data = await response.json()
    if (data.access) {
      localStorage.setItem("accessToken", data.access)
      return true
    }

    return false
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

// Helper function to handle API responses with token refresh
async function handleResponse<T>(response: Response, retried = false): Promise<T> {
  if (response.ok) {
    return response.json()
  }

  // If unauthorized and not retried yet, try to refresh token
  if (response.status === 401 && !retried) {
    const refreshed = await refreshToken()
    if (refreshed) {
      // Retry the original request with new token
      const newToken = getAuthToken()
      const newOptions = { ...response.clone().headers, Authorization: `Bearer ${newToken}` }
      const newResponse = await fetch(response.url, {
        method: response.clone().method,
        headers: newOptions,
        body: response.clone().method !== "GET" ? await response.clone().text() : undefined,
      })

      return handleResponse<T>(newResponse, true)
    }
  }

  // Try to get error message from response
  let errorMessage
  try {
    const errorData = await response.json()
    errorMessage = errorData.detail || errorData.message || `API error: ${response.status}`
  } catch (e) {
    errorMessage = `API error: ${response.status}`
  }
  throw new Error(errorMessage)
}

// Common fetch options with authentication
const getRequestOptions = (method = "GET", body?: any): RequestInit => {
  const token = getAuthToken()
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  return options
}

// API Client functions

// Authentication
export async function loginUser(username: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<{ token: string }>(response)
}

export async function registerUser(userData: {
  username: string
  email: string
  password: string
}): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  return handleResponse<{ token: string }>(response)
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, getRequestOptions())
  return handleResponse<Category[]>(response)
}

export async function fetchCategoryById(categoryId: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, getRequestOptions())
  return handleResponse<Category>(response)
}

export async function fetchCategoryLessons(categoryId: string): Promise<Lesson[]> {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lessons`, getRequestOptions())
  return handleResponse<Lesson[]>(response)
}

// Lessons
export async function fetchLessons(): Promise<Lesson[]> {
  const response = await fetch(`${API_BASE_URL}/lessons`, getRequestOptions())
  return handleResponse<Lesson[]>(response)
}

export async function fetchLessonById(lessonId: number): Promise<Lesson> {
  const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, getRequestOptions())
  return handleResponse<Lesson>(response)
}

// Learning Items - transform API response to match our app's expected format
export async function fetchLessonItems(lessonId: number): Promise<ImageItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/items`, getRequestOptions())

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}):`, errorText)
      throw new Error(`Failed to fetch lesson items: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Validate the response data
    if (!Array.isArray(data)) {
      console.error("Invalid response format, expected an array:", data)
      throw new Error("Invalid response format from API")
    }

    // Transform the data to match our app's expected format
    const transformedItems: ImageItem[] = data.map((item: any) => {
      // Ensure image path is a full URL or path
      const imagePath = item.image.startsWith("http") ? item.image : `/images/${item.image}`

      return {
        id: item.id,
        image: imagePath,
        names: {
          english: item.name_english,
          malay: item.name_malay,
          arabic: item.name_arabic,
        },
        category: item.category || "Unknown",
        isPremium: item.isPremium || false,
        lesson: item.lesson,
      }
    })

    console.log("Transformed lesson items:", transformedItems)
    return transformedItems
  } catch (error) {
    console.error(`Error fetching lesson items for lesson ${lessonId}:`, error)
    throw error
  }
}

// Quizzes - transform API response to match our app's expected format
export async function fetchQuizByLessonId(lessonId: number): Promise<Quiz> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/quiz`, getRequestOptions())

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}):`, errorText)
      throw new Error(`Failed to fetch quiz: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the questions to match our app's expected format
    const transformedQuestions: QuizQuestion[] = data.questions.map((q: any) => {
      // Extract option texts from the options array
      const optionTexts = q.options.map((opt: any) => opt.option_text)

      // Determine the correct answer text based on the correct_answer letter
      const correctAnswerIndex = q.correct_answer.charCodeAt(0) - 65 // Convert A->0, B->1, etc.
      const correctAnswer = optionTexts[correctAnswerIndex] || ""

      return {
        id: q.id,
        question: q.question,
        image: q.image,
        options: optionTexts,
        correctAnswer: correctAnswer,
      }
    })

    const transformedQuiz: Quiz = {
      title: data.title,
      description: data.description,
      questions: transformedQuestions,
    }

    console.log("Transformed quiz:", transformedQuiz)
    return transformedQuiz
  } catch (error) {
    console.error(`Error fetching quiz for lesson ${lessonId}:`, error)
    throw error
  }
}

// Progress tracking
export async function updateItemProgress(itemId: number, completed: boolean, stars: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/progress/items/${itemId}`,
    getRequestOptions("POST", { completed, stars }),
  )
  return handleResponse<void>(response)
}

export async function updateLessonProgress(lessonId: number, completed: boolean, stars: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/progress/lessons/${lessonId}`,
    getRequestOptions("POST", { completed, stars }),
  )
  return handleResponse<void>(response)
}

export async function updateQuizProgress(lessonId: number, completed: boolean, score: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/progress/quizzes/${lessonId}`,
    getRequestOptions("POST", { completed, score }),
  )
  return handleResponse<void>(response)
}

export async function fetchUserProgress(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/progress`, getRequestOptions())
  return handleResponse<any>(response)
}

// Subscription
export async function fetchSubscriptionStatus(): Promise<{ isPremium: boolean }> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/me`, getRequestOptions())
  return handleResponse<{ isPremium: boolean }>(response)
}

export async function purchaseSubscription(paymentDetails: any): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/purchase`, getRequestOptions("POST", paymentDetails))
  return handleResponse<void>(response)
}

// Cache for API responses to reduce unnecessary requests
const lessonsCache: Map<number, Lesson> = new Map()
const categoriesCache: Map<string, Category> = new Map()

// Helper functions that were previously in data.ts
export async function getItemById(lessonId: number, itemId: number): Promise<ImageItem | undefined> {
  try {
    // First try to get the item from the specific lesson
    const items = await fetchLessonItems(lessonId)
    const item = items.find((item) => item.id === itemId)

    if (item) return item

    // If not found, try to search through all lessons
    // This is a fallback for the learn page which might not have the lesson ID
    const lessons = await fetchLessons()
    for (const lesson of lessons) {
      try {
        const lessonItems = await fetchLessonItems(lesson.id)
        const foundItem = lessonItems.find((item) => item.id === itemId)
        if (foundItem) return foundItem
      } catch (error) {
        console.error(`Failed to fetch items for lesson ${lesson.id}:`, error)
      }
    }

    return undefined
  } catch (error) {
    console.error(`Failed to fetch item ${itemId}:`, error)
    return undefined
  }
}

export async function getLessonById(lessonId: number): Promise<Lesson | undefined> {
  // Check cache first
  if (lessonsCache.has(lessonId)) {
    return lessonsCache.get(lessonId)
  }

  try {
    const lesson = await fetchLessonById(lessonId)
    // Cache the result
    lessonsCache.set(lessonId, lesson)
    return lesson
  } catch (error) {
    console.error(`Failed to fetch lesson ${lessonId}:`, error)
    return undefined
  }
}

// Clear the cache (useful when data might have changed)
export function clearCache(): void {
  lessonsCache.clear()
  categoriesCache.clear()
}
