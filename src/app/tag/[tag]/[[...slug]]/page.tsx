import { Metadata, ResolvingMetadata } from 'next'
import { ArticleOverview } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'

async function getArticles(
  tag: string,
): Promise<Array<ArticleOverview> | null> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/list?tags=${tag}`,
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
    tag: string
    slug: string[]
  }
}

export default async function Page({ params }: Props) {
  let page: number = 1
  if (params.slug !== undefined && params.slug.length > 0) {
    page = parseInt(params.slug[0])
    if (isNaN(page)) {
      page = 1
    }
  }

  const { tag } = params
  const data: Array<ArticleOverview> | null = await getArticles(tag)
  const maxPageNum: number | null = await getMaxPageNumber(tag)

  if (data === null || maxPageNum === null) {
    console.log('test: ' + maxPageNum)
    notFound()
  }

  return (
    <div>
      <div className="flex flex-row justify-center mt-7">
        <ArticleTag tag={tag} noLink className="mr-2" />
        <h3>が付いている記事</h3>
      </div>
      <ArticleList articles={data} currentPage={page} totalPages={maxPageNum} />
    </div>
  )
}
