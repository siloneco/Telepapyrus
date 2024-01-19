import { GeneralTable } from '@/components/ui/GeneralTable'
import { PresentationArticleOverview } from '@/layers/use-case/article/ArticleUseCase'
import { columns } from './columns'

type Props = {
  data: PresentationArticleOverview[]
}
export function ArticleTable({ data }: Props) {
  return (
    <GeneralTable
      columns={columns}
      data={data}
      notFoundText="記事が見つかりませんでした"
      searchColumnId="title"
      searchPlaceholder="タイトルを検索"
    />
  )
}
