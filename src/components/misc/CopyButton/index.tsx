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
      className={cn('h-6 w-6 hover:bg-gray-700 hover:text-gray-200', className)}
      onClick={onClick}
      aria-label="copy"
    >
      <span className="flex text-center">
        {!copied && <CopyIcon size={15} className="text-inherit/60 mx-auto" />}
        {copied && <CheckIcon size={15} className="text-green-500 mx-auto" />}
      </span>
    </Button>
  )
}
