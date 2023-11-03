import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Post } from '@/components/types/Post'
import styles from './style/style.module.css'
import { notFound } from 'next/navigation'

async function getPost(id: string): Promise<Post | null> {
    const res = await fetch(`http://localhost:3000/api/internal/post/${id}`, { next: { revalidate: 60 } })
    if (res.status === 404) {
        return null
    }
    return res.json()
}

type Props = {
    params: { postid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
    const data: Post | null = await getPost(params.postid)

    if (data === null) {
        return {
            title: '404 Not Found | Silolab Blog',
        }
    }

    return {
        title: `${data.title} | Silolab Blog`,
    }
}

export default async function Page({ params }: { params: { postid: string } }) {
    const data: Post | null = await getPost(params.postid)

    if (data === null) {
        notFound()
    }

    return (
        <div className={styles.article}>
            <ArticleHeader title={data.title} date={data.formatted_date} lastUpdated={data.last_updated} tags={data.tags} />
            <ArticleRenderer content={data.content} />
        </div>
    )
}