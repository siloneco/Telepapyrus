import { GeneralTable } from '@/components/ui/GeneralTable'
import { columns } from './columns'
import { DraftOverview } from '@/layers/entity/types'

type Props = {
  data: DraftOverview[]
}
export function DraftTable({ data }: Props) {
  return (
    <GeneralTable
      columns={columns}
      data={data}
      notFoundText="下書きが見つかりませんでした"
      searchColumnId="id"
      searchPlaceholder="IDを検索"
    />
  )
}
