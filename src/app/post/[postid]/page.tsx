import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import { Post } from '@/components/types/Post'
import styles from './style/style.module.css'
import { MDXRemote } from 'next-mdx-remote/rsc'

import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import { SerializeOptions } from 'next-mdx-remote/dist/types'
import './style/codeBlockStyle.css'

const rpcOptions = {
    defaultLang: 'plaintext',
    theme: 'slack-dark',
    keepBackground: false,
    grid: false,
}

const mdxOptions: SerializeOptions = {
    mdxOptions: {
        rehypePlugins: [
            rehypeSanitize,
            [rehypePrettyCode, rpcOptions],
        ],
    }
}

async function getPost(id: string): Promise<Post> {
    const res = await fetch(`http://localhost:3000/api/internal/post/${id}`, { next: { revalidate: 60 } })
    return res.json()
}

type Props = {
    params: { postid: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const data: Post = await getPost(params.postid)

    return {
        title: `${data.title} | Silolab Blog`,
    }
}

const components = {}

export default async function Page({ params }: { params: { postid: string } }) {
    const data: Post = await getPost(params.postid)
    return (
        <div className={styles.article}>
            <ArticleHeader title={data.title} date={data.formatted_date} lastUpdated={data.last_updated} tags={data.tags} />
            <MDXRemote source={data.content} components={{ ...components }}
                options={{ ...mdxOptions }}
            />
        </div>
    )
}