import styles from './page.module.css'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'

async function getPosts(page: number) {
  const res = await fetch(`http://localhost:3000/api/posts/` + page, { next: { revalidate: 60 } })
  return res.json()
}

async function getMaxPageNumber() {
  const res = await fetch(`http://localhost:3000/api/internal/pages`, { next: { revalidate: 60 } })
  return (await res.json()).max
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  let page: number = 1
  if (params.slug !== undefined && params.slug.length > 0) {
    page = parseInt(params.slug[0])
    if (isNaN(page)) {
      page = 1
    }
  }

  const data = await getPosts(page)
  return (
    <main className={styles.main}>
      <h1>Posts</h1>
      <div className={styles.articleContainer}>
        {data.map((post: any, index: number) => (
          <ArticleCard key={index} id={post.id} title={post.title} date={post.formatted_date} lastUpdated={post.last_updated} tags={post.tags} />
        ))}
        <PageSelector currentPage={page} totalPages={await getMaxPageNumber()} />
      </div>
    </main>
  )
}
