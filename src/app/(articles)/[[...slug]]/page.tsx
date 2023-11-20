import { Metadata, ResolvingMetadata } from 'next'
import { ArticleOverview } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'
import ArticleList from '@/components/layout/ArticleList'

async function getArticles(page: number): Promise<Array<ArticleOverview>> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/list?page=${page}`,
    { next: { revalidate: 60 } },
  )
  return res.json()
}

async function getMaxPageNumber(): Promise<number> {
  const res = await fetch(`${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/count`, {
    next: { revalidate: 60 },
  })
  return Math.ceil((await res.json()).count / 10)
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

  const data: Array<ArticleOverview> = await getArticles(page)
  const maxPage: number = await getMaxPageNumber()

  return (
    <div className="mt-10">
      <ArticleList articles={data} currentPage={page} totalPages={maxPage} />
    </div>
  )
}
