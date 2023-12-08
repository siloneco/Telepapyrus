import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Article } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/Constants'

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
  const data: Article | null = await getArticle(params.id)

  if (data === null) {
    return {
      title: '404 Not Found | Silolab Blog',
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
  const data: Article | null = await getArticle(params.id)

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
