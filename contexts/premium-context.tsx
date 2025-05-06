"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PremiumContextType {
  showSupportModal: boolean
  setShowSupportModal: (value: boolean) => void
  redirectToSupport: () => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false)

  const redirectToSupport = () => {
    // Redirect to the support page
    window.location.href = "/support"
  }

  return (
    <PremiumContext.Provider
      value={{
        showSupportModal,
        setShowSupportModal,
        redirectToSupport,
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
