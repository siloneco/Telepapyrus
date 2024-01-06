'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, SaveIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  className?: string
  checked: boolean
  loading?: boolean
  onClick: () => Promise<void>
}

export default function SaveButton({
  className,
  checked,
  loading,
  onClick,
}: Props) {
  const [selfLoading, setSelfLoading] = useState(false)

  const onButtonClicked = async () => {
    setSelfLoading(true)
    await onClick()
    setSelfLoading(false)
  }

  const isLoading = loading === undefined ? selfLoading : loading

  return (
    <Button
      variant="ghost"
      className={cn('h-8 w-8', className)}
      onClick={onButtonClicked}
    >
      <span className="flex text-center">
        {isLoading && (
          <Loader2
            size={20}
            className="text-card-foreground/60 mx-auto animate-spin"
          />
        )}
        {!isLoading && !checked && (
          <SaveIcon size={20} className="text-foreground/60 mx-auto" />
        )}
        {!isLoading && checked && (
          <CheckIcon size={20} className="text-green-500 mx-auto" />
        )}
      </span>
    </Button>
  )
}
