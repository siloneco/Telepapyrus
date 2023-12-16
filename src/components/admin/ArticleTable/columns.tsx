'use client'

import ArticleTag from '@/components/article/ArticleTag'
import { ArticleOverview } from '@/components/types/Article'
import { ColumnDef } from '@tanstack/react-table'
import { ActionButton } from './actions'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<ArticleOverview>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id: string = row.getValue('id')

      return (
        <a href={`/article/${id}`} className="decoration-inherit text-inherit">
          {id}
        </a>
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

      return (
        <div>
          {tags.map((tag) => (
            <ArticleTag key={tag} tag={tag} className="mr-2 my-1" noLink />
          ))}
        </div>
      )
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
      const article: ArticleOverview = row.original
      return <ActionButton article={article} />
    },
  },
]
