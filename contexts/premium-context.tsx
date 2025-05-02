"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface PremiumContextType {
  isPremium: boolean
  setPremium: (value: boolean) => void
  showPremiumModal: boolean
  setShowPremiumModal: (value: boolean) => void
  redirectToPayment: () => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false)
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false)

  // Load premium status from localStorage on initial render
  useEffect(() => {
    const savedPremiumStatus = localStorage.getItem("premiumStatus")
    if (savedPremiumStatus) {
      setIsPremium(JSON.parse(savedPremiumStatus))
    }
  }, [])

  // Save premium status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("premiumStatus", JSON.stringify(isPremium))
  }, [isPremium])

  const setPremium = (value: boolean) => {
    setIsPremium(value)
  }

  const redirectToPayment = () => {
    window.location.href = "https://securecheckout.hit-pay.com/payment-request/@techworld-pte-ltd"
  }

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        setPremium,
        showPremiumModal,
        setShowPremiumModal,
        redirectToPayment,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider")
  }
  return context
}
