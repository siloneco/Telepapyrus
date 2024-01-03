import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleAlreadyExistsError, ArticleInvalidDataError } from '../errors'
import { PublishableDraft } from '@/layers/entity/types'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'

export const createArticle = async (
  repo: ArticleRepository,
  draft: PublishableDraft,
): Promise<
  Result<true, ArticleAlreadyExistsError | ArticleInvalidDataError | Error>
> => {
  const result = await repo.createArticle(draft)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'already-exists') {
    return new Failure(
      new ArticleAlreadyExistsError(`Article already exists: ${draft.id}`),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(new ArticleInvalidDataError(`Invalid data: ${draft.id}`))
  }

  return new Failure(
    new Error(`Failed to get article: ${result.error?.message}`),
  )
}
