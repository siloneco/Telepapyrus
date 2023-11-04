import { Metadata, ResolvingMetadata } from 'next'
import styles from '@/components/style/Posts.module.css'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'
import { PostOverview } from '@/components/types/Post'
import ArticleTag from '@/components/article/ArticleTag'
import { notFound } from 'next/navigation'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'


async function getPosts(tag: string): Promise<Array<PostOverview> | null> {
    const res = await fetch(`${INTERNAL_BACKEND_HOSTNAME}/api/internal/posts/tag/${tag}`, { next: { revalidate: 60 } })
    if (res.status === 404) {
        return null
    }

    return res.json()
}

async function getMaxPageNumber(tag: string): Promise<{ max: number } | null> {
    const res = await fetch(`${INTERNAL_BACKEND_HOSTNAME}/api/internal/pages/tag/${tag}`, { next: { revalidate: 60 } })
    if (res.status === 404) {
        return null
    }

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
        tag: string,
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
    const maxPageNum: number | undefined = (await getMaxPageNumber(tag))?.max

    if (data === null || maxPageNum === undefined) {
        notFound()
    }

    return (
        <main className={styles.main} style={{ marginTop: '2rem' }}>
            <div className={styles.pageHeader}>
                <ArticleTag tag={tag} />
                <h3 style={{ margin: '0px' }}>が付いている記事</h3>
            </div>
            <div className={styles.articleContainer}>
                {data.map((post: PostOverview) => (
                    <ArticleCard key={post.id} id={post.id} title={post.title} date={post.formatted_date} lastUpdated={post.last_updated} tags={post.tags} />
                ))}
                <PageSelector path={`/tag/${tag}/`} currentPage={page} totalPages={maxPageNum} />
            </div>
        </main>
    )
}

