import { Metadata, ResolvingMetadata } from 'next'
import styles from '@/components/style/Posts.module.css'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'
import { PostOverview } from '@/components/types/Post'

async function getPosts(tag: string): Promise<Array<PostOverview>> {
    const res = await fetch(`http://localhost:3000/api/posts/tag/${tag}`, { next: { revalidate: 60 } })
    return res.json()
}

async function getMaxPageNumber(tag: string) {
    const res = await fetch(`http://localhost:3000/api/internal/pages/tag/${tag}`, { next: { revalidate: 60 } })
    return (await res.json()).max
}

type Props = {
    params: { postid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    return {
        title: "Silolab Blog | しろらぼブログ",
    }
}

export default async function Page({ params }: { params: { tag: string, slug: string[] } }) {
    let page: number = 1
    if (params.slug !== undefined && params.slug.length > 0) {
        page = parseInt(params.slug[0])
        if (isNaN(page)) {
            page = 1
        }
    }

    const tag: string = params.tag
    const data: Array<PostOverview> = await getPosts(tag)
    return (
        <main className={styles.main}>
            <h1>{`Posts - ${tag}`}</h1>
            <div className={styles.articleContainer}>
                {data.map((post: PostOverview, index: number) => (
                    <ArticleCard key={index} id={post.id} title={post.title} date={post.formatted_date} lastUpdated={post.last_updated} tags={post.tags} />
                ))}
                <PageSelector currentPage={page} totalPages={await getMaxPageNumber(tag)} />
            </div>
        </main>
    )
}

