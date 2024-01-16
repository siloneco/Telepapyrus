import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { FlushCacheFunction } from '../ArticleUseCase'
import NodeCache from 'node-cache'
import { UnexpectedBehaviorDetectedError } from '@/layers/entity/errors'

const cache = new NodeCache()
const cacheTTL = 60

export const countArticle = async (
  repo: ArticleRepository,
  tags?: string[],
): Promise<Result<number, UnexpectedBehaviorDetectedError | Error>> => {
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
      new UnexpectedBehaviorDetectedError(`Too many rows selected.`),
    )
  } else if (errorId === 'invalid-data-queried') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(`Invalid data returned.`),
    )
  }

  return new Failure(
    new Error(`Failed to count articles: ${result.error?.message}`),
  )
}

export const flushCountCache: FlushCacheFunction = async (_id: string) => {
  cache.flushAll()
}
