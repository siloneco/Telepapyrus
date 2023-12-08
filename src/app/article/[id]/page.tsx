import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Article } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import { getArticle as getArticleFromDatabase } from '@/lib/database/ArticleQuery'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { sha256 } from '@/lib/utils'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'

async function getArticle(user: string, id: string): Promise<Article | null> {
  return await getArticleFromDatabase(user, id)
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

  const session: any = await getServerSession(authOptions)
  if (
    session === undefined ||
    session === null ||
    session.user?.email === undefined
  ) {
    return {
      title: 'しろらぼブログ | Silolab Blog',
    }
  }

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
    }
  }

  const hashedEmail = sha256(session.user.email)
  const data: Article | null = await getArticle(hashedEmail, params.id)

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
  const session: any = await getServerSession(authOptions)
  if (
    session === undefined ||
    session === null ||
    session.user?.email === undefined
  ) {
    notFound()
  }

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    notFound()
  }

  const hashedEmail = sha256(session.user.email)
  const data: Article | null = await getArticle(hashedEmail, params.id)

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
