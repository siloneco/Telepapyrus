import styles from './page.module.css'
import ArticleCard from '@/components/article/ArticleCard'
import { PostOverview } from '@/components/types/Post'

async function getPosts(): Promise<Array<PostOverview>> {
    // TODO: Implement
    const res = await fetch(`http://localhost:3000/api/posts`, { next: { revalidate: 60 } })
    return res.json()
}

export default async function Page({ params }: { params: { tag: string } }) {
    const data: Array<PostOverview> = await getPosts()
    return (
        <main className={styles.main}>
            <h1>{`Posts - ${params.tag}`}</h1>
            <div className={styles.grid}>
                {/* {data.map((post: PostOverview, index: number) => (
                    <ArticleCard key={index} id={post.id} title={post.title} date={post.date} tags={post.tags} />
                ))} */}
            </div>
        </main>
    )
}
