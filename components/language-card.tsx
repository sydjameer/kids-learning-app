"use client"

import { motion } from "framer-motion"

interface LanguageCardProps {
  language: string
  name: string
  flag: string
  color: string
  bgColor: string
  onClick?: () => void
  active?: boolean
}

export function LanguageCard({ language, name, flag, color, bgColor, onClick, active }: LanguageCardProps) {
  return (
    <motion.div
      className={`p-4 rounded-xl ${bgColor} border-2 ${
        active ? `border-${color.replace("text-", "")}` : "border-transparent"
      } cursor-pointer transition-all`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{flag}</div>
        <div>
          <div className="text-sm text-gray-500">{language}</div>
          <div className={`text-lg font-bold ${color}`}>{name}</div>
        </div>
      </div>
    </motion.div>
  )
}
