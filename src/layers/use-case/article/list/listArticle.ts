import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleExcessiveScopeError, ArticleNotFoundError } from '../errors'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { Article } from '@/layers/entity/types'
import { formatDate } from '@/lib/utils'
import { ListArticleProps, PresentationArticle } from '../ArticleUseCase'

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

export const listArticle = async (
  repo: ArticleRepository,
  { page, tags }: ListArticleProps,
): Promise<
  Result<
    PresentationArticle[],
    ArticleNotFoundError | ArticleExcessiveScopeError | Error
  >
> => {
  const result = await repo.listArticle({ page, tags })
  if (result.success) {
    const presentationArticles = result.data!.map((article) =>
      convertToPresentationArticle(article),
    )
    return new Success(presentationArticles)
  }

  return new Failure(
    new Error(`Failed to list article: ${result.error?.message}`),
  )
}
