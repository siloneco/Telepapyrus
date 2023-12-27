import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import {
  ArticleExcessiveScopeError,
  ArticleUnexpectedReturnValueError,
} from '../errors'
import { FlushCacheFunction } from '../ArticleUseCase'
import NodeCache from 'node-cache'

const cache = new NodeCache()
const cacheTTL = 60

export const countArticle = async (
  repo: ArticleRepository,
  tags?: string[],
): Promise<
  Result<
    number,
    ArticleExcessiveScopeError | ArticleUnexpectedReturnValueError | Error
  >
> => {
  const cacheKey = tags ? JSON.stringify(tags?.sort()) : 'all'

  const cached = cache.get<number>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.countArticle(tags)
  if (result.success) {
    const data = result.data!
    cache.set(cacheKey, data, cacheTTL)
    return new Success(data)
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

export const flushCountCache: FlushCacheFunction = async (_id: string) => {
  cache.flushAll()
}
