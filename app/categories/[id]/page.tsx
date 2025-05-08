"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { LessonCard } from "@/components/lesson-card"
import { fetchCategoryById } from "@/lib/api-client"
import type { Category } from "@/types"
import { OverallProgress } from "@/components/overall-progress"

export default function CategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const foundCategory = await fetchCategoryById(params.id)

        if (foundCategory) {
          setCategory(foundCategory)
        } else {
          console.error(`Category with ID ${params.id} not found`)
        }
      } catch (error) {
        console.error("Failed to load category:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-2xl text-purple-600 font-bold">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Category not found</h1>
          <p className="mb-8">We couldn't find the category you're looking for.</p>
          <Button asChild>
            <Link href="/">Go back to categories</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-${category.bgColor.replace("bg-", "")} to-white`}>
      <OverallProgress />

      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className={category.color}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to categories</span>
          </Button>
          <h1 className={`text-3xl font-bold ${category.color}`}>
            {category.icon} {category.name} Lessons
          </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </header>

        <main>
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <LessonCard
                    id={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    image={lesson.image}
                    categoryId={category.id}
                    categoryColor={category.color}
                    categoryBgColor={category.bgColor}
                  />
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
