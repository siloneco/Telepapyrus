'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

type Props = {
  className?: string
  children?: React.ReactNode
}

export default function SignOutNavButton({ className }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" aria-label="sign-out-popover-trigger">
          <LogOut className={className} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Button
          variant="destructive"
          onClick={() => signOut()}
          aria-label="sign-out"
        >
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  )
}
