import { Metadata, ResolvingMetadata } from 'next'
import { ArticleOverview } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import ArticleList from '@/components/layout/ArticleList'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'
import { queryAllArticles } from '@/lib/database/ArticleListQuery'
import { countArticle } from '@/lib/database/ArtistCountQuery'

async function getArticles(
  user: string,
  page: number,
): Promise<Array<ArticleOverview> | null> {
  const data = await queryAllArticles(user, page)
  return data
}

async function getMaxPageNumber(user: string): Promise<number> {
  const data = await countArticle(user, [])
  if (data === null) {
    return 1
  }

  return Math.ceil(data.count / 10)
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
  const session: any = await getServerSession(authOptions)
  if (
    session === undefined ||
    session === null ||
    session.user?.email === undefined
  ) {
    console.log('test')
    notFound()
  }

  const hashedEmail = sha256(session.user.email)

  let page: number = 1
  if (params.slug !== undefined && params.slug.length > 0) {
    page = parseInt(params.slug[0])
    if (isNaN(page)) {
      notFound()
    }
  }

  const data: Array<ArticleOverview> | null = await getArticles(
    hashedEmail,
    page,
  )
  const maxPage: number = await getMaxPageNumber(hashedEmail)

  if (data === null || data.length === 0) {
    return (
      <div className="w-full mt-10 mx-auto md:w-[768px]">
        <p className="flex justify-center">記事がありません</p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <ArticleList articles={data} currentPage={page} totalPages={maxPage} />
    </div>
  )
}
