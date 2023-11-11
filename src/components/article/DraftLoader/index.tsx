import { getDraftData } from '@/lib/article/DraftArticleCache'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Draft } from '@/components/types/Post'

type Props = {
  postid: string
}

export default async function DraftLoader({ postid }: Props) {
  const data: Draft | undefined = await getDraftData(postid)

  if (data === undefined) {
    return <p>undefined</p>
  }

  return <ArticleRenderer content={data.content} />
}
