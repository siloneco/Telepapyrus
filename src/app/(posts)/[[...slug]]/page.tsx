import { Metadata, ResolvingMetadata } from 'next'
import { PostOverview } from '@/components/types/Post'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'
import PostList from '@/components/layout/PostList'

async function getPosts(page: number): Promise<Array<PostOverview>> {
  const res = await fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/internal/posts/all/${page}`,
    { next: { revalidate: 60 } },
  )
  return res.json()
}

async function getMaxPageNumber(): Promise<number> {
  const res = await fetch(`${INTERNAL_BACKEND_HOSTNAME}/api/internal/pages`, {
    next: { revalidate: 60 },
  })
  return (await res.json()).max
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

  const data: Array<PostOverview> = await getPosts(page)
  const maxPage: number = await getMaxPageNumber()

  return (
    <div className="mt-10">
      <PostList posts={data} currentPage={page} totalPages={maxPage} />
    </div>
  )
}
