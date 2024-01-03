'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ActionButton } from './actions'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import TagList from '@/components/model/TagList'
import { PresentationArticleOverview } from '@/layers/use-case/article/ArticleUseCase'

export const columns: ColumnDef<PresentationArticleOverview>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id: string = row.getValue('id')

      return (
        <div className="max-w-[150px] text-ellipsis overflow-hidden">
          <a
            href={`/article/${id}`}
            className="decoration-inherit text-inherit whitespace-nowrap"
          >
            {id}
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'タイトル',
    cell: ({ row }) => {
      const id: string = row.original.id
      const title: string = row.getValue('title')

      return (
        <a href={`/article/${id}`} className="decoration-inherit text-inherit">
          {title}
        </a>
      )
    },
  },
  {
    accessorKey: 'tags',
    header: 'タグ',
    cell: ({ row }) => {
      const tags: string[] = row.getValue('tags')

      return <TagList tags={tags} noLink />
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          投稿日時
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'last_updated',
    header: () => {
      return <span className="whitespace-nowrap">最終更新</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const article: PresentationArticleOverview = row.original
      return <ActionButton article={article} />
    },
  },
]
