import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star } from "lucide-react"
import { useProgress } from "@/contexts/progress-context"

interface LessonCardProps {
  id: number
  title: string
  description: string
  image: string
  categoryId: string
  categoryColor: string
  categoryBgColor: string
}

export function LessonCard({
  id,
  title,
  description,
  image,
  categoryId,
  categoryColor,
  categoryBgColor,
}: LessonCardProps) {
  const { isLessonCompleted, getLessonStars } = useProgress()
  const completed = isLessonCompleted(id)
  const stars = getLessonStars(id)

  return (
    <Card
      className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${categoryBgColor} border-2 relative`}
    >
      {completed && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle className="h-6 w-6 text-green-500 fill-white" />
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-4">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-contain" />
          </div>
          <h3 className={`text-xl font-bold ${categoryColor} mb-2`}>{title}</h3>
          <p className="text-gray-600 mb-2">{description}</p>

          {completed && (
            <div className="flex items-center mt-2">
              {[...Array(stars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
