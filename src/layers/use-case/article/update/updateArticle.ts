import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { PublishableDraft } from '@/layers/entity/types'
import { InvalidDataError, NotFoundError } from '@/layers/entity/errors'

export const updateArticle = async (
  repo: ArticleRepository,
  draft: PublishableDraft,
): Promise<Result<true, NotFoundError | InvalidDataError | Error>> => {
  const result = await repo.updateArticle(draft)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new NotFoundError(`Article not found: ${draft.id}`))
  } else if (errorId === 'invalid-data') {
    return new Failure(new InvalidDataError(`Invalid data: ${draft.id}`))
  }

  return new Failure(
    new Error(`Failed to update article: ${result.error?.message}`),
  )
}
