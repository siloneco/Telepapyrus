import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Article } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import {
  ARTICLE_ID_MAX_LENGTH,
  INTERNAL_BACKEND_HOSTNAME,
} from '@/lib/constants/Constants'

async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`${INTERNAL_BACKEND_HOSTNAME}/api/v1/article/${id}`, {
    next: { revalidate: 60 },
  })
  if (res.status === 404) {
    return null
  }
  return res.json()
}

type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const NOT_FOUND_PAGE_TITLE = '404 Not Found | Silolab Blog'
  const id = params.id

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
    }
  }

  const data: Article | null = await getArticle(id)

  if (data === null) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
    }
  }

  return {
    title: `${data.title} | Silolab Blog`,
  }
}

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const id = params.id

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    notFound()
  }

  const data: Article | null = await getArticle(id)

  if (data === null) {
    notFound()
  }

  return (
    <div className="max-w-3xl mt-5 mx-3 md:mx-auto">
      <ArticleHeader
        id={data.id}
        title={data.title}
        date={data.date}
        lastUpdated={data.last_updated}
        tags={data.tags}
      />
      <ArticleRenderer content={data.content} />
    </div>
  )
}
