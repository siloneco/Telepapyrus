import styles from './page.module.css'
import ArticleCard from '@/components/article/ArticleCard'

async function getPosts() {
  const res = await fetch(`http://localhost:3000/api/posts`, { next: { revalidate: 10 } })
  return res.json()
}

export default async function Page() {
  const data = await getPosts()
  return (
    <main className={styles.main}>
      <h1>Posts</h1>
      <div className={styles.grid}>
        {data.map((post: any, index: number) => (
          <ArticleCard key={index} id={post.id} title={post.title} date={post.date} tags={post.tags} />
        ))}
      </div>
    </main>
  )
}
