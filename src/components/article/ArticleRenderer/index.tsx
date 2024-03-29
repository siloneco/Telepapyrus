import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import style from './style/style.module.css'
import './style/codeBlockStyle.css'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
  A,
  CompiledInput,
  Figure,
  FigCaption,
  Ul,
  OptimizedImage,
} from './components/GeneralTags'
import CodeBlockPre from './components/codeblock/CodeBlockPre'
import { FC, memo } from 'react'
import { rehypeImageSizeCache } from './components/plugin/RehypeImageSizeCache'

const rpcOptions = {
  defaultLang: 'plaintext',
  theme: 'slack-dark',
  keepBackground: false,
  grid: false,
}

const mdxOptions: any = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [
      rehypeSanitize,
      [rehypePrettyCode, rpcOptions],
      rehypeImageSizeCache,
    ],
  },
}

const components = {
  figure: (props: any) => <Figure {...props} />,
  figcaption: (props: any) => <FigCaption {...props} />,
  pre: (props: any) => <CodeBlockPre {...props} />,
  a: (props: any) => <A {...props} />,
  ul: (props: any) => <Ul {...props} />,
  input: (props: any) => <CompiledInput {...props} />,
  hr: (props: any) => <Separator {...props} />,
  img: (props: any) => <OptimizedImage {...props} />,
}

type Props = {
  content: string
}

type CompiledMDXProps = {
  source: string
  components: any
  options: any
}

export default async function ArticleRenderer({ content }: Props) {
  const CompiledMDX: FC<CompiledMDXProps> = memo(function generateCompiledMDX(
    props: CompiledMDXProps,
  ) {
    return (
      <article
        className={cn(style.article, 'prose dark:prose-invert max-w-none')}
      >
        <MDXRemote
          source={props.source}
          components={{ ...props.components }}
          options={{ ...props.options }}
        />
      </article>
    )
  })

  return (
    <CompiledMDX
      source={content}
      components={components}
      options={mdxOptions}
    />
  )
}
