import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { notFound } from 'next/navigation'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { isValidID } from '@/lib/utils'
import {
  PresentationArticle,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'

async function getArticle(id: string): Promise<PresentationArticle | null> {
  const result = await getArticleUseCase().getArticle(id)
  if (result.isSuccess()) {
    return result.value
  }

  return null
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
  const id = decodeURI(params.id)

  if (id.length > ARTICLE_ID_MAX_LENGTH || !isValidID(id)) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
    }
  }

  const data: PresentationArticle | null = await getArticle(id)

  if (data === null) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
    }
  }

  return {
    title: data.title,
    description: data.description,
  }
}

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const id = decodeURI(params.id)

  if (id.length > ARTICLE_ID_MAX_LENGTH || !isValidID(id)) {
    notFound()
  }

  const data: PresentationArticle | null = await getArticle(id)

  if (data === null) {
    notFound()
  }

  return (
    <div className="max-w-3xl mt-5 mx-auto p-4 md:p-6 bg-card rounded-2xl">
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
