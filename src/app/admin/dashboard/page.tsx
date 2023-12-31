import { ArticleTable } from '@/components/admin/ArticleTable'
import { columns } from '@/components/admin/ArticleTable/columns'
import { NewArticleInput } from '@/components/admin/NewArticleInput'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Silolab Blog',
}

async function getArticleOverview(): Promise<PresentationArticleOverview[]> {
  const result = await getArticleUseCase().listArticle({})

  if (result.isSuccess()) {
    return result.value
  }

  console.error(`Failed to get article overview: ${result.error}`)

  return []
}

export default async function Page() {
  const data: PresentationArticleOverview[] = await getArticleOverview()

  return (
    <div className="max-w-5xl mx-auto mt-5 mb-10">
      <h1 className="text-4xl font-bold text-center">Dashboard (WIP)</h1>
      <div className="w-1/2 mx-auto mt-4">
        <NewArticleInput />
      </div>
      <div className="w-4/5 mx-auto">
        <h2 className="text-xl font-bold mt-8 mb-2">記事一覧</h2>
        <div className="w-full">
          <ArticleTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
