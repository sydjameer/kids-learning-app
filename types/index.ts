export interface ImageItem {
  id: number
  image: string
  names: {
    english: string
    malay: string
    arabic: string
  }
}

export interface LearningProgress {
  [key: string]: {
    completed: boolean
    stars: number
    categoryId?: string
    quizCompleted?: boolean
    quizScore?: number
  }
}

export interface Category {
  id: string
  name: string
  color: string
  bgColor: string
  icon: string
  isPremium: boolean
  lessons: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  description: string
  image: string
  isPremium: boolean
  items: ImageItem[]
  quiz: Quiz
}

export interface Quiz {
  title: string
  description: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: number
  question: string
  image?: string
  options: string[]
  correctAnswer: string
}

export interface Question {
  id: number
  question: string
  image: string
  options: string[]
  correctAnswer: string
}
