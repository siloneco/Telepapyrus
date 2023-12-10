import { Metadata, ResolvingMetadata } from 'next'
import { ArticleOverview } from '@/components/types/Article'
import { notFound } from 'next/navigation'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'
import { queryWithTags } from '@/lib/database/ArticleListQuery'
import { countArticle } from '@/lib/database/ArticleCountQuery'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'

async function getArticles(
  user: string,
  tag: string,
  page: number = 1,
): Promise<Array<ArticleOverview> | null> {
  return await queryWithTags(user, [tag], page)
}

async function getMaxPageNumber(
  user: string,
  tag: string,
): Promise<number | null> {
  const data = await countArticle(user, [tag])

  if (data === null) {
    return null
  }

  return Math.ceil(data.count / 10)
}

export async function generateMetadata(
  {},
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'Telepapyrus',
  }
}

type Props = {
  params: {
    tag: string
    slug: string[]
  }
}

export default async function Page({ params }: Props) {
  const tag = decodeURI(params.tag)

  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.email === undefined) {
    notFound()
  }

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

  const hashedEmail = sha256(session.user.email)

  const data: Array<ArticleOverview> | null = await getArticles(
    hashedEmail,
    tag,
  )
  const maxPageNum: number | null = await getMaxPageNumber(hashedEmail, tag)

  if (data === null || maxPageNum === null) {
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
