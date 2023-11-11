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
        <ArticleTag tag={tag} />
        <h3>が付いている記事</h3>
      </div>
      <PostList posts={data} currentPage={page} totalPages={maxPageNum} />
    </div>
  )

  // return (
  //   <main className={styles.main} style={{ marginTop: '2rem' }}>
  //     <div className={styles.pageHeader}>
  //       <ArticleTag tag={tag} />
  //       <h3 style={{ margin: '0px' }}>が付いている記事</h3>
  //     </div>
  //     <div className={styles.articleContainer}>
  //       {data.map((post: PostOverview) => (
  //         <ArticleCard
  //           key={post.id}
  //           id={post.id}
  //           title={post.title}
  //           date={post.formatted_date}
  //           lastUpdated={post.last_updated}
  //           tags={post.tags}
  //         />
  //       ))}
  //       <PageSelector
  //         path={`/tag/${tag}/`}
  //         currentPage={page}
  //         totalPages={maxPageNum}
  //       />
  //     </div>
  //   </main>
  // )
}
