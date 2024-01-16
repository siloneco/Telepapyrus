import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

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

  if (errorId === 'not-exists') {
    return new Failure(new NotFoundError(`Article not found: ${id}`))
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(`Too many rows affected: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to delete article: ${result.error?.message}`),
  )
}
