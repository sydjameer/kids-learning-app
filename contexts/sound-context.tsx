"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

interface SoundContextType {
  playCorrect: () => void
  playIncorrect: () => void
  playClick: () => void
  playSuccess: () => void
  playUnlock: () => void
  isMuted: boolean
  toggleMute: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [soundsInitialized, setSoundsInitialized] = useState<boolean>(false)

  const correctSound = useRef<HTMLAudioElement | null>(null)
  const incorrectSound = useRef<HTMLAudioElement | null>(null)
  const clickSound = useRef<HTMLAudioElement | null>(null)
  const successSound = useRef<HTMLAudioElement | null>(null)
  const unlockSound = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements safely
  useEffect(() => {
    // Only initialize sounds in browser environment
    if (typeof window !== "undefined") {
      try {
        correctSound.current = new Audio("/sounds/correct.mp3")
        incorrectSound.current = new Audio("/sounds/incorrect.mp3")
        clickSound.current = new Audio("/sounds/click.mp3")
        successSound.current = new Audio("/sounds/success.mp3")
        unlockSound.current = new Audio("/sounds/unlock.mp3")
        setSoundsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize sounds:", error)
      }

      // Load mute preference from localStorage
      try {
        const savedMuteStatus = localStorage.getItem("soundMuted")
        if (savedMuteStatus) {
          setIsMuted(JSON.parse(savedMuteStatus))
        }
      } catch (error) {
        console.error("Failed to load sound preferences:", error)
      }

      setIsLoaded(true)
    }
  }, [])

  // Save mute preference to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("soundMuted", JSON.stringify(isMuted))
      } catch (error) {
        console.error("Failed to save sound preferences:", error)
      }
    }
  }, [isMuted, isLoaded])

  const playSound = (sound: HTMLAudioElement | null) => {
    if (sound && !isMuted && soundsInitialized) {
      try {
        sound.currentTime = 0
        sound.play().catch((err) => console.error("Error playing sound:", err))
      } catch (error) {
        console.error("Failed to play sound:", error)
      }
    }
  }

  const playCorrect = () => playSound(correctSound.current)
  const playIncorrect = () => playSound(incorrectSound.current)
  const playClick = () => playSound(clickSound.current)
  const playSuccess = () => playSound(successSound.current)
  const playUnlock = () => playSound(unlockSound.current)

  const toggleMute = () => setIsMuted(!isMuted)

  return (
    <SoundContext.Provider
      value={{
        playCorrect,
        playIncorrect,
        playClick,
        playSuccess,
        playUnlock,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    // Return a fallback context with no-op functions instead of throwing
    return {
      playCorrect: () => {},
      playIncorrect: () => {},
      playClick: () => {},
      playSuccess: () => {},
      playUnlock: () => {},
      isMuted: false,
      toggleMute: () => {},
    }
  }
  return context
}
