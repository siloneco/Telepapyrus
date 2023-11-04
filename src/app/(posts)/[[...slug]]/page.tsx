import { Metadata, ResolvingMetadata } from 'next'
import styles from '@/components/style/Posts.module.css'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'
import { PostOverview } from '@/components/types/Post'
import { notFound } from 'next/navigation'

async function getPosts(page: number): Promise<Array<PostOverview>> {
  const res = await fetch(`http://localhost:3000/api/internal/posts/all/${page}`, { next: { revalidate: 60 } })
  return res.json()
}

async function getMaxPageNumber() {
  const res = await fetch(`http://localhost:3000/api/internal/pages`, { next: { revalidate: 60 } })
  return (await res.json()).max
}

type MetadataProps = {
  params: { postid: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ }: MetadataProps, _parent: ResolvingMetadata): Promise<Metadata> {
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
  return (
    <main className={styles.main}>
      <div className={styles.articleContainer}>
        {data.map((post: PostOverview, index: number) => (
          <ArticleCard key={index} id={post.id} title={post.title} date={post.formatted_date} lastUpdated={post.last_updated} tags={post.tags} />
        ))}
        <PageSelector path={'/'} currentPage={page} totalPages={await getMaxPageNumber()} />
      </div>
    </main>
  )
}
