import { Metadata, ResolvingMetadata } from 'next'
import { ArticleOverview } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import {
  INTERNAL_BACKEND_HOSTNAME,
  TAG_NAME_MAX_LENGTH,
} from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'

async function getArticles(
  tag: string,
  page: number = 1,
): Promise<Array<ArticleOverview> | null> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/list?tags=${tag}&page=${page}`,
    { next: { revalidate: 60 } },
  )
  if (res.status === 404) {
    return null
  }

  return res.json()
}

async function getMaxPageNumber(tag: string): Promise<number | null> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/count?tags=${tag}`,
    { next: { revalidate: 60 } },
  )
  if (res.status === 404) {
    return null
  }

  const json = await res.json()
  return Math.ceil(json.count / 10)
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
    title: `${params.tag} | Silolab Blog`,
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

  const data: Array<ArticleOverview> | null = await getArticles(tag, page)
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
