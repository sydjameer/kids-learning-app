"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Coffee, Heart, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSound } from "@/contexts/sound-context"

export default function SupportPage() {
  const router = useRouter()
  const { playClick } = useSound()
  const [showThanks, setShowThanks] = useState(false)

  const handleBuyCoffee = () => {
    if (playClick) playClick()
    // In a real app, this would redirect to a payment gateway
    // For now, just show a thank you message
    setShowThanks(true)

    // Redirect to a coffee payment link
    window.open("https://www.buymeacoffee.com/yourname", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-amber-600">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to home</span>
          </Button>
          <h1 className="text-3xl font-bold text-amber-600 ml-4">Support MIT Learn</h1>
        </header>

        <main className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8 overflow-hidden border-2 border-amber-200">
              <div className="bg-amber-500 h-16 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=128&width=128&text=MET"
                      alt="MET Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-4">
                      MIT Learn was developed to help parents like us teaching kids for the Madrasa Entrance Test (MET).
                      We believe that every child deserves access to quality educational resources, regardless of their
                      financial situation.
                    </p>
                    <p className="text-gray-700">
                      That's why we've made all our content completely free! Our app helps children learn words in
                      multiple languages, preparing them for success in their educational journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 overflow-hidden border-2 border-amber-200">
              <div className="bg-amber-500 h-16 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">Support Our Work</h2>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-4">
                    While all content is free, developing and maintaining this app requires time and resources. If you
                    find MIT Learn helpful, consider supporting us by buying a coffee!
                  </p>

                  <motion.div
                    className="inline-block"
                    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Coffee className="h-24 w-24 text-amber-600 mx-auto mb-4" />
                  </motion.div>

                  <p className="text-xl font-bold text-amber-600 mb-6">
                    Your $2.00 contribution helps keep this project going!
                  </p>

                  {showThanks ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-100 text-green-700 p-4 rounded-lg mb-4"
                    >
                      <Heart className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-bold">Thank you for your support!</p>
                      <p>Your contribution helps us continue our mission.</p>
                    </motion.div>
                  ) : (
                    <Button
                      onClick={handleBuyCoffee}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full text-lg"
                    >
                      <Coffee className="mr-2 h-5 w-5" />
                      Buy us a coffee ($2.00)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-amber-200">
              <div className="bg-amber-500 h-16 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white">About MET</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  The Madrasa Entrance Test (MET) is an important assessment for children seeking admission to Islamic
                  educational institutions. It tests knowledge in various subjects, including language proficiency in
                  English, Arabic, and other languages.
                </p>
                <p className="text-gray-700 mb-4">
                  Our app focuses on helping children learn vocabulary in multiple languages, which is a crucial
                  component of the MET. By making learning fun and interactive, we hope to help children succeed in
                  their educational journey.
                </p>
                <div className="flex justify-center mt-6">
                  <Link
                    href="https://example.com/met-info"
                    target="_blank"
                    className="flex items-center text-amber-600 hover:text-amber-700"
                  >
                    Learn more about MET
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>© {new Date().getFullYear()} MIT Learn - Making learning fun!</p>
          <div className="flex justify-center items-center mt-2">
            <span className="text-sm mr-2">🇸🇬</span>
            <span className="text-xs text-gray-500">Made with ❤️ in Singapore</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
