import type { ImageItem, Lesson, Quiz } from "@/types"

// Fallback data for learning items
const fallbackLearningItems: ImageItem[] = [
  {
    id: 1,
    image: "/images/apple.png",
    names: {
      english: "Apple",
      malay: "Epal",
      arabic: "تُفَّاحَةٌ (Tuffaha)",
    },
  },
  {
    id: 2,
    image: "/images/banana.png",
    names: {
      english: "Banana",
      malay: "Pisang",
      arabic: "موزة (Mawza)",
    },
  },
  {
    id: 3,
    image: "/images/orange.png",
    names: {
      english: "Orange",
      malay: "Oren",
      arabic: "برتقالة (Burtuqala)",
    },
  },
  {
    id: 4,
    image: "/images/cat.png",
    names: {
      english: "Cat",
      malay: "Kucing",
      arabic: "قطة (Qitta)",
    },
  },
  {
    id: 5,
    image: "/images/dog.png",
    names: {
      english: "Dog",
      malay: "Anjing",
      arabic: "كلب (Kalb)",
    },
  },
  {
    id: 6,
    image: "/images/bird.png",
    names: {
      english: "Bird",
      malay: "Burung",
      arabic: "طائر (Ta'ir)",
    },
  },
  {
    id: 7,
    image: "/images/car.png",
    names: {
      english: "Car",
      malay: "Kereta",
      arabic: "سيارة (Sayyara)",
    },
  },
  {
    id: 8,
    image: "/images/bicycle.png",
    names: {
      english: "Bicycle",
      malay: "Basikal",
      arabic: "دراجة (Darrajah)",
    },
  },
  {
    id: 9,
    image: "/images/bus.png",
    names: {
      english: "Bus",
      malay: "Bas",
      arabic: "حافلة (Hafila)",
    },
  },
  {
    id: 10,
    image: "/images/sun.png",
    names: {
      english: "Sun",
      malay: "Matahari",
      arabic: "شمس (Shams)",
    },
  },
  {
    id: 11,
    image: "/images/moon.png",
    names: {
      english: "Moon",
      malay: "Bulan",
      arabic: "قمر (Qamar)",
    },
  },
  {
    id: 12,
    image: "/images/star.png",
    names: {
      english: "Star",
      malay: "Bintang",
      arabic: "نجمة (Najma)",
    },
  },
]

// Define quizzes for each lesson
const fruitsQuiz: Quiz = {
  title: "Fruits Quiz",
  description: "Test your knowledge of fruit names in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'Apple'?",
      image: "/images/apple.png",
      options: ["Pisang", "Epal", "Oren", "Tuffaha"],
      correctAnswer: "Epal",
    },
    {
      id: 2,
      question: "Which fruit is called 'موزة (Mawza)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["Apple", "Orange", "Banana", "Grape"],
      correctAnswer: "Banana",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/orange.png",
      options: ["Apple", "Banana", "Orange", "Strawberry"],
      correctAnswer: "Orange",
    },
  ],
}

const colorsQuiz: Quiz = {
  title: "Colors Quiz",
  description: "Test your knowledge of color names in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'Red'?",
      image: "/images/red.png",
      options: ["Biru", "Hijau", "Merah", "Kuning"],
      correctAnswer: "Merah",
    },
    {
      id: 2,
      question: "Which color is called 'أزرق (Azraq)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: "Blue",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/green.png",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: "Green",
    },
  ],
}

const animalsQuiz: Quiz = {
  title: "Animals Quiz",
  description: "Test your knowledge of animal names in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'Cat'?",
      image: "/images/cat.png",
      options: ["Anjing", "Kucing", "Burung", "Ikan"],
      correctAnswer: "Kucing",
    },
    {
      id: 2,
      question: "Which animal is called 'كلب (Kalb)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correctAnswer: "Dog",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/bird.png",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correctAnswer: "Bird",
    },
  ],
}

const vehiclesQuiz: Quiz = {
  title: "Vehicles Quiz",
  description: "Test your knowledge of vehicle names in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'Car'?",
      image: "/images/car.png",
      options: ["Bas", "Kereta", "Basikal", "Kapal"],
      correctAnswer: "Kereta",
    },
    {
      id: 2,
      question: "Which vehicle is called 'دراجة (Darrajah)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["Car", "Bus", "Bicycle", "Train"],
      correctAnswer: "Bicycle",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/bus.png",
      options: ["Car", "Bus", "Bicycle", "Train"],
      correctAnswer: "Bus",
    },
  ],
}

const natureQuiz: Quiz = {
  title: "Nature Quiz",
  description: "Test your knowledge of nature words in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'Sun'?",
      image: "/images/sun.png",
      options: ["Bulan", "Matahari", "Bintang", "Awan"],
      correctAnswer: "Matahari",
    },
    {
      id: 2,
      question: "Which nature element is called 'قمر (Qamar)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["Sun", "Moon", "Star", "Cloud"],
      correctAnswer: "Moon",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/star.png",
      options: ["Sun", "Moon", "Star", "Cloud"],
      correctAnswer: "Star",
    },
  ],
}

const numbersQuiz: Quiz = {
  title: "Numbers Quiz",
  description: "Test your knowledge of numbers in different languages",
  questions: [
    {
      id: 1,
      question: "What is the Malay word for 'One'?",
      image: "/images/number-1.png",
      options: ["Satu", "Dua", "Tiga", "Empat"],
      correctAnswer: "Satu",
    },
    {
      id: 2,
      question: "Which number is called 'اثنان (Ithnan)' in Arabic?",
      image: "/images/question-mark.png",
      options: ["One", "Two", "Three", "Four"],
      correctAnswer: "Two",
    },
    {
      id: 3,
      question: "Match the image to its English name:",
      image: "/images/number-3.png",
      options: ["One", "Two", "Three", "Four"],
      correctAnswer: "Three",
    },
  ],
}

// Define lessons data
const fallbackLessons: Lesson[] = [
  {
    id: 1,
    title: "Fruits",
    description: "Learn fruit names in multiple languages",
    image: "/images/apple.png",
    isPremium: false,
    items: [
      fallbackLearningItems[0], // Apple
      fallbackLearningItems[1], // Banana
      fallbackLearningItems[2], // Orange
    ],
    quiz: fruitsQuiz,
  },
  {
    id: 2,
    title: "Colors",
    description: "Learn color names in multiple languages",
    image: "/images/colors.png",
    isPremium: false,
    items: [
      {
        id: 13,
        image: "/images/red.png",
        names: {
          english: "Red",
          malay: "Merah",
          arabic: "أحمر (Ahmar)",
        },
      },
      {
        id: 14,
        image: "/images/blue.png",
        names: {
          english: "Blue",
          malay: "Biru",
          arabic: "أزرق (Azraq)",
        },
      },
      {
        id: 15,
        image: "/images/green.png",
        names: {
          english: "Green",
          malay: "Hijau",
          arabic: "أخضر (Akhdar)",
        },
      },
    ],
    quiz: colorsQuiz,
  },
  {
    id: 3,
    title: "Animals",
    description: "Learn animal names in multiple languages",
    image: "/images/cat.png",
    isPremium: true,
    items: [
      fallbackLearningItems[3], // Cat
      fallbackLearningItems[4], // Dog
      fallbackLearningItems[5], // Bird
    ],
    quiz: animalsQuiz,
  },
  {
    id: 4,
    title: "Vehicles",
    description: "Learn vehicle names in multiple languages",
    image: "/images/car.png",
    isPremium: true,
    items: [
      fallbackLearningItems[6], // Car
      fallbackLearningItems[7], // Bicycle
      fallbackLearningItems[8], // Bus
    ],
    quiz: vehiclesQuiz,
  },
  {
    id: 5,
    title: "Nature",
    description: "Learn nature words in multiple languages",
    image: "/images/sun.png",
    isPremium: true,
    items: [
      fallbackLearningItems[9], // Sun
      fallbackLearningItems[10], // Moon
      fallbackLearningItems[11], // Star
    ],
    quiz: natureQuiz,
  },
  {
    id: 6,
    title: "Numbers",
    description: "Learn numbers in multiple languages",
    image: "/images/numbers.png",
    isPremium: true,
    items: [
      {
        id: 16,
        image: "/images/number-1.png",
        names: {
          english: "One",
          malay: "Satu",
          arabic: "واحد (Wahid)",
        },
      },
      {
        id: 17,
        image: "/images/number-2.png",
        names: {
          english: "Two",
          malay: "Dua",
          arabic: "اثنان (Ithnan)",
        },
      },
      {
        id: 18,
        image: "/images/number-3.png",
        names: {
          english: "Three",
          malay: "Tiga",
          arabic: "ثلاثة (Thalatha)",
        },
      },
    ],
    quiz: numbersQuiz,
  },
]

export async function fetchLearningItems(): Promise<ImageItem[]> {
  // In v0 preview, just return the fallback data directly
  return fallbackLearningItems
}

export async function fetchLessons(): Promise<Lesson[]> {
  // In v0 preview, just return the fallback lessons data
  return fallbackLessons
}

export function getItemById(itemId: number): ImageItem | undefined {
  return fallbackLearningItems.find((item) => item.id === itemId)
}

export function getLessonById(lessonId: number): Lesson | undefined {
  return fallbackLessons.find((lesson) => lesson.id === lessonId)
}
