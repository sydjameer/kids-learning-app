"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function SingaporeBranding() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center bg-white rounded-full shadow-md p-2 border border-gray-200"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image src="/images/singapore-flag.png" alt="Singapore Flag" fill className="object-contain" />
          </div>
          <span className="text-xs font-medium text-gray-600 hidden sm:inline">Made in Singapore</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative w-16 h-16 sm:w-20 sm:h-20"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
      >
        <Image src="/images/merlion-cartoon.png" alt="Merlion Cartoon" fill className="object-contain" />
      </motion.div>
    </div>
  )
}
