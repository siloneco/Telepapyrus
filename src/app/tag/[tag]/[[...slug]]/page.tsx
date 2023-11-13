import { Metadata, ResolvingMetadata } from 'next'
import { PostOverview } from '@/components/types/Post'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'
import PostList from '@/components/layout/PostList'
import ArticleTag from '@/components/article/ArticleTag'

async function getPosts(tag: string): Promise<Array<PostOverview> | null> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/internal/posts/tag/${tag}`,
    { next: { revalidate: 60 } },
  )
  if (res.status === 404) {
    return null
  }

  return res.json()
}

async function getMaxPageNumber(tag: string): Promise<number | null> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/internal/pages/tag/${tag}`,
    { next: { revalidate: 60 } },
  )
  if (res.status === 404) {
    return null
  }

  const json = await res.json()
  return json.max
}

type MetadataProps = {
  params: { postid: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  {}: MetadataProps,
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
  const data: Array<PostOverview> | null = await getPosts(tag)
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
      <PostList posts={data} currentPage={page} totalPages={maxPageNum} />
    </div>
  )
}
