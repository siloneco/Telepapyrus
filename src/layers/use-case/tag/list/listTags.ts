import { Failure, Result, Success } from '@/lib/utils/Result'
import { TagRepository } from '@/layers/repository/TagRepository'
import NodeCache from 'node-cache'

const cache = new NodeCache()
const cacheTTL = 60
const cacheKey = 'key'

export const listTags = async (
  repo: TagRepository,
): Promise<Result<string[], Error>> => {
  const cached = cache.get<string[]>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.listTags()
  if (result.success) {
    const data = result.data!
    cache.set(cacheKey, data, cacheTTL)
    return new Success(data)
  }

  return new Failure(new Error(`Failed to get draft: ${result.error?.message}`))
}

export const flushListCache = async (_: string): Promise<void> => {
  cache.del(cacheKey)
}
