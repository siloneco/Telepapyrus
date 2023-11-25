import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import style from './style/style.module.css'
import './style/codeBlockStyle.css'
import { cn } from '@/lib/utils'
import CodeBlockTitle from './components/codeblock/CodeBlockTitle'
import CodeBlockPre from './components/codeblock/CodeBlockPre'
import CodeBlockDiv from './components/codeblock/CodeBlockDiv'

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

const components = {
  div: (props: any) => {
    if (props['data-rehype-pretty-code-title'] !== undefined) {
      return <CodeBlockTitle {...props} />
    }
    if (props['data-rehype-pretty-code-fragment'] !== undefined) {
      return <CodeBlockDiv {...props} />
    }
    return <div {...props} />
  },
  pre: (props: any) => <CodeBlockPre {...props} />,
}

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
