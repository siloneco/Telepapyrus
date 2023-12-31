import ArticleRenderer from '@/components/article/ArticleRenderer'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftNotFoundError } from '@/layers/use-case/draft/errors'

type Props = {
  id: string
}

export default async function PreviewLoader({ id }: Props) {
  const result = await getDraftUseCase().getDraftForPreview(id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof DraftNotFoundError) {
      return <p>Not Found</p>
    }

    return <p>Internal Server Error</p>
  }

  return <ArticleRenderer content={result.value.content} />
}
