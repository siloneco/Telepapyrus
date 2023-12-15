'use client'

import { ArticleOverview } from '@/components/types/Article'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExternalLink, MoreHorizontal } from 'lucide-react'
import { DeleteDialogTrigger, DeleteDialogWrapper } from './delete-dialog'

function getBaseURL(): string {
  const protocol = document.location.protocol
  const hostname = document.location.hostname
  return `${protocol}//${hostname}`
}

function generateURL(id: string): string {
  return `${getBaseURL()}/article/${id}`
}

type Props = {
  article: ArticleOverview
}

export function ActionButton({ article }: Props) {
  const executeDelete = (id: string) => {
    fetch(`${getBaseURL()}/api/v1/article/${id}`, {
      method: 'DELETE',
    }).then(() => {
      location.reload()
    })
  }

  return (
    <DeleteDialogWrapper article={article} executeDelete={executeDelete}>
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
              href={`/article/${article.id}`}
              className="decoration-inherit text-inherit"
            >
              <ExternalLink size={16} className="text-gray-600 mr-1" />
              移動
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(generateURL(article.id))
            }
          >
            URLをコピー
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(article.id)}
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
