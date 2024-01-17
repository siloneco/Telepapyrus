import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'
import { concatErrorMessages } from '@/lib/utils'

export const deleteArticle = async (
  repo: ArticleRepository,
  id: string,
): Promise<
  Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
> => {
  const result = await repo.deleteArticle(id)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id
  const errorMsg = result.error?.message

  if (errorId === 'not-exists') {
    return new Failure(
      new NotFoundError(
        concatErrorMessages(`Article "${id}" not found`, errorMsg),
      ),
    )
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(
        concatErrorMessages(
          `Too many rows affected while deleting article "${id}"`,
          errorMsg,
        ),
      ),
    )
  }

  return new Failure(
    new Error(
      concatErrorMessages(`Failed to delete article "${id}"`, errorMsg),
    ),
  )
}
