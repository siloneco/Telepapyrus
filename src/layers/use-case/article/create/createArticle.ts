import { Failure, Result, Success } from '@/lib/utils/Result'
import { PublishableDraft } from '@/layers/entity/types'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { AlreadyExistsError, InvalidDataError } from '@/layers/entity/errors'

export const createArticle = async (
  repo: ArticleRepository,
  draft: PublishableDraft,
): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>> => {
  const result = await repo.createArticle(draft)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'already-exists') {
    return new Failure(
      new AlreadyExistsError(`Article already exists: ${draft.id}`),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(new InvalidDataError(`Invalid data: ${draft.id}`))
  }

  return new Failure(
    new Error(`Failed to get article: ${result.error?.message}`),
  )
}
