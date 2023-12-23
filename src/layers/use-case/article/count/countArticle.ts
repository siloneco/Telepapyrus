import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  ArticleExcessiveScopeError,
  ArticleUnexpectedReturnValueError,
} from '../errors'

export const countArticle = async (
  repo: ArticleRepository,
  tags?: string[],
): Promise<
  Result<
    number,
    ArticleExcessiveScopeError | ArticleUnexpectedReturnValueError | Error
  >
> => {
  const result = await repo.countArticle(tags)
  if (result.success) {
    return new Success(result.data!)
  }

  const errorId = result.error?.id

  if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new ArticleExcessiveScopeError(`Too many rows selected.`),
    )
  } else if (errorId === 'invalid-data-queried') {
    return new Failure(
      new ArticleUnexpectedReturnValueError(`Invalid data returned.`),
    )
  }

  return new Failure(
    new Error(`Failed to count articles: ${result.error?.message}`),
  )
}
