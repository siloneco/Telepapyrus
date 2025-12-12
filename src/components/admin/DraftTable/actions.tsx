'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, MoreHorizontal } from 'lucide-react'
import { DeleteDialogTrigger, DeleteDialogWrapper } from './delete-dialog'
import { DraftOverview } from '@/layers/entity/types'
import { toast } from 'sonner'

function getBaseURL(): string {
  const protocol = document.location.protocol
  const hostname = document.location.hostname
  return `${protocol}//${hostname}`
}

type Props = {
  draft: DraftOverview
}

export function ActionButton({ draft }: Props) {
    const executeDelete = (id: string) => {
    fetch(`${getBaseURL()}/api/v1/draft/${id}`, {
      method: 'DELETE',
    }).then(() => {
      location.reload()
    })
  }

  const showCopiedToast = () => {
    toast("コピーしました！", {
      icon: <Check size={24} className="text-green-500" />,
      className: 'md:w-48 bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground',
      duration: 1500,
    })
  }

  return (
    <DeleteDialogWrapper draft={draft} executeDelete={executeDelete}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={`/admin/draft/${draft.id}`}
              className="decoration-inherit text-inherit"
            >
              編集
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(draft.id)
              showCopiedToast()
            }}
          >
            IDをコピー
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-bold text-destructive focus:text-destructive">
            <DeleteDialogTrigger />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteDialogWrapper>
  )
}
