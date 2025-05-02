import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ProgressProvider } from "@/contexts/progress-context"
import { PremiumProvider } from "@/contexts/premium-context"
import { SoundProvider } from "@/contexts/sound-context"
import { SoundToggle } from "@/components/sound-toggle"
import { PremiumModal } from "@/components/premium-modal"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            @font-face {
              font-family: 'ChildsPlay';
              src: url('/fonts/ChildsPlay.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            
            body {
              font-family: 'ChildsPlay', sans-serif;
            }
          `}
        </style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SoundProvider>
            <PremiumProvider>
              <ProgressProvider>
                {children}
                <SoundToggle />
                <PremiumModal />
              </ProgressProvider>
            </PremiumProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
