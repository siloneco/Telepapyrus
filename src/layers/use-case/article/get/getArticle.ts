import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleExcessiveScopeError, ArticleNotFoundError } from '../errors'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { Article } from '@/layers/entity/types'
import { formatDate } from '@/lib/utils'
import { PresentationArticle } from '../ArticleUseCase'

const convertToPresentationArticle = (article: Article) => {
  const presentationArticle: PresentationArticle = {
    ...article,
    date: formatDate(article.date),
    last_updated: article.last_updated
      ? formatDate(article.last_updated)
      : null,
  }

  return presentationArticle
}

export const getArticle = async (
  repo: ArticleRepository,
  id: string,
): Promise<
  Result<
    PresentationArticle,
    ArticleNotFoundError | ArticleExcessiveScopeError | Error
  >
> => {
  const result = await repo.getArticle(id)
  if (result.success) {
    const presentationArticle = convertToPresentationArticle(result.data!)
    return new Success(presentationArticle)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new ArticleNotFoundError(`Article not found: ${id}`))
  } else if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new ArticleExcessiveScopeError(`Too many rows selected: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to get article: ${result.error?.message}`),
  )
}
