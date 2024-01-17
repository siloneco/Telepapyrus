import { Failure, Result, Success } from '@/lib/utils/Result'
import { PublishableDraft } from '@/layers/entity/types'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { AlreadyExistsError, InvalidDataError } from '@/layers/entity/errors'
import { concatErrorMessages } from '@/lib/utils'

export const createArticle = async (
  repo: ArticleRepository,
  draft: PublishableDraft,
): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>> => {
  const result = await repo.createArticle(draft)
  if (result.success) {
    return new Success(true)
  }

  const draftId = draft.id
  const errorId = result.error?.id
  const errorMsg = result.error?.message

  if (errorId === 'already-exists') {
    return new Failure(
      new AlreadyExistsError(
        concatErrorMessages(`Article "${draftId}" already exists`, errorMsg),
      ),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(
      new InvalidDataError(
        concatErrorMessages(
          `Article "${draftId}" contains invalid data`,
          errorMsg,
        ),
      ),
    )
  }

  return new Failure(
    new Error(
      concatErrorMessages(`Failed to get article "${draftId}"`, errorMsg),
    ),
  )
}
