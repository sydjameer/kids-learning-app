import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackMessageProps {
  correct: boolean
  message: string
}

export function FeedbackMessage({ correct, message }: FeedbackMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 rounded-xl text-center text-lg font-bold",
        correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
      )}
    >
      {correct ? <CheckCircle className="h-6 w-6 mr-2" /> : <XCircle className="h-6 w-6 mr-2" />}
      {message}
    </div>
  )
}
