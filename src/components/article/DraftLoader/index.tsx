import { getDraftData } from '@/lib/article/DraftCache'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { Draft } from '@/components/types/Article'
import { sha256 } from '@/lib/utils'

type Props = {
  userEmail: string
  id: string
}

export default async function DraftLoader({ userEmail, id }: Props) {
  const emailHash = sha256(userEmail)
  const data: Draft | undefined = await getDraftData(emailHash, id)

  if (data === undefined) {
    return <p>undefined</p>
  }

  return <ArticleRenderer content={data.content} />
}
