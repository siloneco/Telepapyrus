import { getDraftData } from '@/lib/article/DraftCache'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Draft } from '@/components/types/Article'

type Props = {
  id: string
}

export default async function DraftLoader({ id }: Props) {
  const data: Draft | undefined = await getDraftData(id)

  if (data === undefined) {
    return <p>undefined</p>
  }

  return <ArticleRenderer content={data.content} />
}
