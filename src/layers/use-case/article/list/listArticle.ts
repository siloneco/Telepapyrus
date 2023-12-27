import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { Article } from '@/layers/entity/types'
import { formatDate } from '@/lib/utils'
import { ListArticleProps, PresentationArticle } from '../ArticleUseCase'
import NodeCache from 'node-cache'

const cache = new NodeCache()
const cacheTTL = 60

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
): Promise<Result<PresentationArticle[], Error>> => {
  const cacheKeyObject = {
    page,
    tags: tags ? tags.sort() : [],
  }
  const cacheKey = JSON.stringify(cacheKeyObject)

  const cached = cache.get<PresentationArticle[]>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.listArticle({ page, tags })
  if (result.success) {
    const presentationArticles = result.data!.map((article) =>
      convertToPresentationArticle(article),
    )

    cache.set(cacheKey, presentationArticles, cacheTTL)
    return new Success(presentationArticles)
  }

  return new Failure(
    new Error(`Failed to list article: ${result.error?.message}`),
  )
}

export const flushListCache = async (_: string) => {
  cache.flushAll()
}
