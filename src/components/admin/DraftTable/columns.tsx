'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ActionButton } from './actions'
import { DraftOverview } from '@/layers/entity/types'

export const columns: ColumnDef<DraftOverview>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id: string = row.getValue('id')

      return (
        <div className="max-w-[150px] text-ellipsis overflow-hidden">
          <a
            href={`/admin/draft/${id}`}
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
        <a
          href={`/admin/draft/${id}`}
          className="decoration-inherit text-inherit"
        >
          {title}
        </a>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const draft: DraftOverview = row.original
      return <ActionButton draft={draft} />
    },
  },
]
