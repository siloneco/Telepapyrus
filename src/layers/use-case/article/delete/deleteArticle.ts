import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleExcessiveScopeError, ArticleNotFoundError } from '../errors'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'

export const deleteArticle = async (
  repo: ArticleRepository,
  id: string,
): Promise<
  Result<true, ArticleNotFoundError | ArticleExcessiveScopeError | Error>
> => {
  const result = await repo.deleteArticle(id)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new ArticleNotFoundError(`Article not found: ${id}`))
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new ArticleExcessiveScopeError(`Too many rows affected: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to delete article: ${result.error?.message}`),
  )
}
