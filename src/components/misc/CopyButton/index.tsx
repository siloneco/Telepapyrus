'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  value: string
  className?: string
}

export default function CopyButton({ value, className }: Props) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    setCopied(true)
    if (navigator.clipboard !== undefined) {
      navigator.clipboard.writeText(value)
    }
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000)
    }
  }, [copied])

  return (
    <Button
      variant="ghost"
      className={cn(
        'h-6 w-6 p-0',
        'text-card-foreground/60 bg-transparent', // define text and background color
        'hover:text-card-foreground/60 hover:bg-transparent', // disable hover color changes
        className,
      )}
      onClick={onClick}
      aria-label="copy"
    >
      <span className="flex text-center">
        {!copied && <CopyIcon size={15} className="mx-auto text-inherit" />}
        {copied && (
          <CheckIcon
            size={15}
            className="mx-auto text-green-600 dark:text-green-500"
          />
        )}
      </span>
    </Button>
  )
}
