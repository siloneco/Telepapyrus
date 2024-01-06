'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ExternalLink, MoreHorizontal } from 'lucide-react'
import { DeleteDialogTrigger, DeleteDialogWrapper } from './delete-dialog'
import { useToast } from '@/components/ui/use-toast'
import { PresentationArticleOverview } from '@/layers/use-case/article/ArticleUseCase'

function getBaseURL(): string {
  const protocol = document.location.protocol
  const hostname = document.location.hostname
  return `${protocol}//${hostname}`
}

function generateURL(id: string): string {
  return `${getBaseURL()}/article/${id}`
}

type Props = {
  article: PresentationArticleOverview
}

export function ActionButton({ article }: Props) {
  const { toast } = useToast()

  const executeDelete = (id: string) => {
    fetch(`${getBaseURL()}/api/v1/article/${id}`, {
      method: 'DELETE',
    }).then(() => {
      location.reload()
    })
  }

  const showCopiedToast = () => {
    toast({
      title: 'コピーしました！',
      titleIcon: <Check size={24} className="text-green-500" />,
      className:
        'md:w-48 bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground',
      duration: 1500,
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
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink
                size={16}
                className="text-card-foreground/40 mr-1"
              />
              開く
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(generateURL(article.id))
              showCopiedToast()
            }}
          >
            URLをコピー
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(article.id)
              showCopiedToast()
            }}
          >
            IDをコピー
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href={`/admin/edit/${article.id}`}
              className="decoration-inherit text-inherit"
            >
              編集
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="font-bold text-destructive focus:text-destructive">
            <DeleteDialogTrigger />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteDialogWrapper>
  )
}
