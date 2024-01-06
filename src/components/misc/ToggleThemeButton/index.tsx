'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

type Props = {
  className?: string
}
export default function ToggleThemeButton({ className }: Props) {
  const { theme, setTheme } = useTheme()

  const onClick = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const ariaLabel =
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Button
      variant={'outline'}
      onClick={onClick}
      className={cn('h-8 w-8 bg-card', className)}
      aria-label={ariaLabel}
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
