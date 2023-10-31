import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Post } from '@/components/types/Post'
import styles from './style/style.module.css'

async function getPost(id: string): Promise<Post> {
    const res = await fetch(`http://localhost:3000/api/internal/post/${id}`, { next: { revalidate: 60 } })
    return res.json()
}

type Props = {
    params: { postid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
    const data: Post = await getPost(params.postid)

    return {
        title: `${data.title} | Silolab Blog`,
    }
}

export default async function Page({ params }: { params: { postid: string } }) {
    const data: Post = await getPost(params.postid)
    return (
        <div className={styles.article}>
            <ArticleHeader title={data.title} date={data.formatted_date} lastUpdated={data.last_updated} tags={data.tags} />
            <ArticleRenderer content={data.content} />
        </div>
    )
}