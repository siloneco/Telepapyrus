'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, SaveIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  className?: string
  checked: boolean
  onClick: () => Promise<void>
}

export default function SaveButton({ className, checked, onClick }: Props) {
  const [loading, setLoading] = useState(false)

  const onButtonClicked = async () => {
    setLoading(true)
    await onClick()
    setLoading(false)
  }

  return (
    <Button
      variant="ghost"
      className={cn('h-8 w-8', className)}
      onClick={onButtonClicked}
    >
      <span className="flex text-center">
        {loading && (
          <Loader2 size={20} className="text-gray-500 mx-auto animate-spin" />
        )}
        {!loading && !checked && (
          <SaveIcon size={20} className="text-gray-500 mx-auto" />
        )}
        {!loading && checked && (
          <CheckIcon size={20} className="text-green-400 mx-auto" />
        )}
      </span>
    </Button>
  )
}
