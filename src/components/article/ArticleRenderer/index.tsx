import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import style from './style/style.module.css'
import './style/codeBlockStyle.css'
import { cn } from '@/lib/utils'

const rpcOptions = {
  defaultLang: 'plaintext',
  theme: 'slack-dark',
  keepBackground: false,
  grid: false,
}

const mdxOptions: any = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSanitize, [rehypePrettyCode, rpcOptions]],
  },
}

const components = {}

type Props = {
  content: string
}

export default async function ArticleRenderer({ content }: Props) {
  return (
    <article className={cn(style.article, 'prose prose-invert max-w-none')}>
      <MDXRemote
        source={content}
        components={{ ...components }}
        options={{ ...mdxOptions }}
      />
    </article>
  )
}
