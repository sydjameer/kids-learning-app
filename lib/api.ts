import type { Category } from "@/types"

// Fallback data in case the API fails
const fallbackData: Category[] = [
  {
    id: "english",
    name: "English",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: "🇬🇧",
    lessons: [
      {
        id: 1,
        title: "Alphabet",
        description: "Learn the ABC's",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "What letter is this?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["A", "B", "C", "D"],
            correctAnswer: "B",
          },
          {
            id: 2,
            question: "Which letter starts the word 'Dog'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["A", "B", "C", "D"],
            correctAnswer: "D",
          },
        ],
      },
      {
        id: 2,
        title: "Numbers",
        description: "Count and learn numbers",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "What number is this?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["1", "2", "3", "4"],
            correctAnswer: "3",
          },
          {
            id: 2,
            question: "How many stars do you see?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["2", "3", "4", "5"],
            correctAnswer: "4",
          },
        ],
      },
    ],
  },
  {
    id: "malay",
    name: "Malay",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: "🇲🇾",
    lessons: [
      {
        id: 3,
        title: "Colors",
        description: "Learn colors in Malay",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "What color is 'Merah'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Red", "Blue", "Green", "Yellow"],
            correctAnswer: "Red",
          },
          {
            id: 2,
            question: "Which color is 'Biru'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Orange", "Blue", "Purple", "Brown"],
            correctAnswer: "Blue",
          },
        ],
      },
      {
        id: 4,
        title: "Animals",
        description: "Learn animals in Malay",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "What is 'Kucing'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Dog", "Cat", "Elephant", "Lion"],
            correctAnswer: "Cat",
          },
          {
            id: 2,
            question: "Which animal is 'Ikan'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Fish", "Bird", "Rabbit", "Snake"],
            correctAnswer: "Fish",
          },
        ],
      },
    ],
  },
  {
    id: "arabic",
    name: "Arabic",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    icon: "🇸🇦",
    lessons: [
      {
        id: 5,
        title: "Greetings",
        description: "Learn Arabic greetings",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "How do you say 'Hello' in Arabic?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Marhaba", "Shukran", "Afwan", "Na'am"],
            correctAnswer: "Marhaba",
          },
          {
            id: 2,
            question: "Which means 'Thank you'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["Marhaba", "Shukran", "Afwan", "Na'am"],
            correctAnswer: "Shukran",
          },
        ],
      },
      {
        id: 6,
        title: "Numbers",
        description: "Learn numbers in Arabic",
        image: "/placeholder.svg?height=100&width=100",
        questions: [
          {
            id: 1,
            question: "What is 'Wahid'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: "One",
          },
          {
            id: 2,
            question: "Which number is 'Thalatha'?",
            image: "/placeholder.svg?height=300&width=300",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: "Three",
          },
        ],
      },
    ],
  },
]

export async function fetchCategories(): Promise<Category[]> {
  // Since the API is consistently returning malformed JSON, we'll use the fallback data directly
  console.log("Using fallback data instead of API due to JSON parsing issues")
  return fallbackData

  /* 
  // Original implementation - commented out due to persistent JSON parsing errors
  try {
    // First, try to fetch from the API
    const response = await fetch("https://run.mocky.io/v3/bb628c1a-da17-4df7-a7b2-902acc446bad", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API returned status: ${response.status}`)
      return fallbackData
    }

    // Get the response text first to debug any issues
    const responseText = await response.text()

    try {
      // Try to parse the response as JSON
      const data = JSON.parse(responseText)

      // Validate that the data has the expected structure
      if (Array.isArray(data) && data.length > 0) {
        return data as Category[]
      } else {
        console.error("API returned unexpected data structure:", data)
        return fallbackData
      }
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", parseError)
      console.error("Response text:", responseText)
      return fallbackData
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return fallbackData
  }
  */
}

export function getCategoryById(categories: Category[], categoryId: string): Category | undefined {
  return categories.find((category) => category.id === categoryId)
}

export function getLessonById(
  categories: Category[],
  lessonId: number,
): { lesson: any; categoryId: string } | undefined {
  for (const category of categories) {
    const lesson = category.lessons.find((lesson) => lesson.id === lessonId)
    if (lesson) {
      return { lesson, categoryId: category.id }
    }
  }
  return undefined
}

// Export the fallbackData so it can be imported elsewhere
export { fallbackData }
