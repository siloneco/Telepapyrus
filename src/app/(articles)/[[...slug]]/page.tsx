import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleList from '@/components/layout/ArticleList'
import {
  PresentationArticle,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'

async function getArticles(
  page: number,
): Promise<PresentationArticle[] | null> {
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

export async function generateMetadata(
  {},
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'Silolab Blog | しろらぼブログ',
  }
}

type Props = {
  params: {
    slug: string[]
  }
}

export default async function Page({ params }: Props) {
  let page: number = 1
  if (params.slug !== undefined && params.slug.length > 0) {
    page = parseInt(params.slug[0])
    if (isNaN(page)) {
      notFound()
    }
  }

  const data: PresentationArticle[] | null = await getArticles(page)
  const maxPage: number = await getMaxPageNumber()

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
