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

const components = {}

export default async function ArticleRenderer({ content }: { content: string }) {
    return (
        <MDXRemote source={content} components={{ ...components }}
            options={{ ...mdxOptions }}
        />
    )
}