import { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { convertSearchParamPageToInteger } from '@/lib/utils'

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
  }
  searchParams: { [key: string]: string | string[] | undefined }
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

export default async function Page({ params, searchParams }: Props) {
  const tag = decodeURI(params.tag)

  if (tag.length > TAG_NAME_MAX_LENGTH) {
    notFound()
  }

  const rawPage = searchParams['page']
  const maxPageNum: number = (await getMaxPageNumber(tag)) ?? 1
  const pageParseResult = convertSearchParamPageToInteger(rawPage, maxPageNum)

  if (!pageParseResult.isValid && !pageParseResult.fallback) {
    redirect(`/tag/${tag}/`)
  }

  if (pageParseResult.fallback) {
    redirect(`/tag/${tag}/?page=${pageParseResult.page!}`)
  }

  const page: number = pageParseResult.page!

  const data: PresentationArticleOverview[] | null = await getArticles(
    tag,
    page,
  )

  if (data === null || maxPageNum === null) {
    notFound()
  }

  return (
    <div>
      <div className="flex flex-row justify-center items-center my-7">
        <h2 className="text-xl">タグで絞り込み: </h2>
        <ArticleTag tag={tag} noLink className="ml-2" />
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
