import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { PublishableDraft } from '@/layers/entity/types'
import { InvalidDataError, NotFoundError } from '@/layers/entity/errors'
import { concatErrorMessages } from '@/lib/utils'

export const updateArticle = async (
  repo: ArticleRepository,
  draft: PublishableDraft,
): Promise<Result<true, NotFoundError | InvalidDataError | Error>> => {
  const result = await repo.updateArticle(draft)
  if (result.success) {
    return new Success(true)
  }

  const draftId = draft.id
  const errorId = result.error?.id
  const errorMsg = result.error?.message

  if (errorId === 'not-exists') {
    return new Failure(
      new NotFoundError(
        concatErrorMessages(`Article "${draftId}" not found`, errorMsg),
      ),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(
      new InvalidDataError(
        concatErrorMessages(
          `New data for article "${draftId}" contains invalid data`,
          errorMsg,
        ),
      ),
    )
  }

  return new Failure(
    new Error(
      concatErrorMessages(`Failed to update article "${draftId}"`, errorMsg),
    ),
  )
}
