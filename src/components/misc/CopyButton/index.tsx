'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  className: string
  value: string
}

export default function CopyButton({ className, value }: Props) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    setCopied(true)
    navigator.clipboard.writeText(value)
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  return (
    <Button
      variant="ghost"
      className={cn('h-6 w-6', className)}
      onClick={onClick}
    >
      <span className="flex text-center">
        {!copied && <CopyIcon size={15} className="text-gray-500 mx-auto" />}
        {copied && <CheckIcon size={15} className="text-green-400 mx-auto" />}
      </span>
    </Button>
  )
}
