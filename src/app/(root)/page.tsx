import { Metadata } from 'next'
import ArticleList from '@/components/layout/ArticleList'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { redirect } from 'next/navigation'
import { convertSearchParamPageToInteger } from '@/lib/utils'

async function getArticles(
  page: number,
): Promise<PresentationArticleOverview[] | null> {
  const result = await getArticleUseCase().listArticle({ page: page })
  if (result.isSuccess()) {
    return result.value
  }

  return null
}

async function getMaxPageNumber(): Promise<number> {
  const result = await getArticleUseCase().countArticle()

  if (result.isSuccess()) {
    return Math.ceil(result.value / 10)
  }

  return -1
}

export const metadata: Metadata = {
  title: 'ホーム | Silolab Blog',
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const rawPage = searchParams['page']
  const maxPage: number = await getMaxPageNumber()
  const pageParseResult = convertSearchParamPageToInteger(rawPage, maxPage)

  if (!pageParseResult.isValid && !pageParseResult.fallback) {
    redirect('/')
  }

  if (pageParseResult.fallback) {
    redirect(`/?page=${pageParseResult.page!}`)
  }

  const page: number = pageParseResult.page!

  const data: PresentationArticleOverview[] | null = await getArticles(page)

  if (data === null) {
    return (
      <div className="mt-10">
        <p>記事の取得に失敗しました</p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <ArticleList articles={data} currentPage={page} totalPages={maxPage} />
    </div>
  )
}
