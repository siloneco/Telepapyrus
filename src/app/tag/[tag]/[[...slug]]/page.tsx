import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'

async function getArticles(
  tag: string,
  page: number = 1,
): Promise<PresentationArticleOverview[] | null> {
  const result = await getArticleUseCase().listArticle({
    tags: [tag],
    page: page,
  })

  if (result.isSuccess()) {
    return result.value
  }

  return null
}

async function getMaxPageNumber(tag: string): Promise<number | null> {
  const result = await getArticleUseCase().countArticle([tag])

  if (result.isSuccess()) {
    return Math.ceil(result.value / 10)
  }

  return null
}

type Props = {
  params: {
    tag: string
    slug: string[]
  }
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  params.tag = decodeURI(params.tag)

  return {
    title: `タグ ${params.tag} が付いている記事`,
    robots: 'noindex',
  }
}

export default async function Page({ params }: Props) {
  const tag = decodeURI(params.tag)

  if (tag.length > TAG_NAME_MAX_LENGTH) {
    notFound()
  }

  let page: number = 1
  if (params.slug !== undefined && params.slug.length > 0) {
    page = parseInt(params.slug[0])
    if (isNaN(page)) {
      page = 1
    }
  }

  const data: PresentationArticleOverview[] | null = await getArticles(
    tag,
    page,
  )
  const maxPageNum: number | null = await getMaxPageNumber(tag)

  if (data === null || maxPageNum === null) {
    notFound()
  }

  return (
    <div>
      <div className="flex flex-row justify-center mt-7">
        <ArticleTag tag={tag} noLink className="mr-2" />
        <h3>が付いている記事</h3>
      </div>
      <ArticleList
        articles={data}
        currentPage={page}
        totalPages={maxPageNum}
        path={`/tag/${tag}/`}
      />
    </div>
  )
}
