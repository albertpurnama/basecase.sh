"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ModeToggleProps {
  isScrolled: boolean;
}

export function ModeToggle({ isScrolled }: ModeToggleProps) {
  const { setTheme, theme } = useTheme()
  const [isAnimating, setIsAnimating] = React.useState(false)

  return (
    <button
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light")
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 500)
      }}
      className={`
        p-2 rounded-full relative
        ${isAnimating ? 'animate-bounce scale-110' : ''}
        hover:scale-110 transition-all duration-500
        max-sm:bg-gray-100 max-sm:dark:bg-gray-800
        ${isScrolled ? 'max-sm:backdrop-blur-sm max-sm:bg-gray-100/50 max-sm:dark:bg-gray-800/50' : ''}
        w-10 h-10
      `}
    >
      <div className="w-6 h-6 relative">
        {theme === "dark" ? (
          <Sun className="h-6 w-6 dark:text-white text-black" />
        ) : (
          <Moon className="h-6 w-6 dark:text-white text-black" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
