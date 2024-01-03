import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  ListArticleProps,
  PresentationArticleOverview,
} from '../ArticleUseCase'
import NodeCache from 'node-cache'
import { formatDate } from '@/lib/utils'

const cache = new NodeCache()
const cacheTTL = 60

export const listArticle = async (
  repo: ArticleRepository,
  { page, tags }: ListArticleProps,
): Promise<Result<PresentationArticleOverview[], Error>> => {
  const cacheKeyObject = {
    page,
    tags: tags ? tags.sort() : [],
  }
  const cacheKey = JSON.stringify(cacheKeyObject)

  const cached = cache.get<PresentationArticleOverview[]>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.listArticle({ page, tags })
  if (result.success) {
    const resultData: PresentationArticleOverview[] = result.data!.map(
      (article) => ({
        ...article,
        date: formatDate(article.date),
        last_updated: article.last_updated
          ? formatDate(article.last_updated)
          : undefined,
      }),
    )

    cache.set(cacheKey, resultData, cacheTTL)
    return new Success(resultData)
  }

  return new Failure(
    new Error(`Failed to list article: ${result.error?.message}`),
  )
}

export const flushListCache = async (_: string) => {
  cache.flushAll()
}
