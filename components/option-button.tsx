"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OptionButtonProps {
  option: string
  selected: boolean
  correct: boolean
  incorrect: boolean
  disabled: boolean
  onClick: () => void
}

export function OptionButton({ option, selected, correct, incorrect, disabled, onClick }: OptionButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-16 text-lg font-medium border-2 transition-all",
        selected && "border-purple-500",
        correct && "bg-green-100 border-green-500 text-green-700",
        incorrect && "bg-red-100 border-red-500 text-red-700",
        !disabled && "hover:bg-purple-100 hover:border-purple-500",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {option}
    </Button>
  )
}
