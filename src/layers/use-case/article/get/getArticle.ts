import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { Article } from '@/layers/entity/types'
import { concatErrorMessages, formatDate } from '@/lib/utils'
import { FlushCacheFunction, PresentationArticle } from '../ArticleUseCase'
import NodeCache from 'node-cache'
import {
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

const cache = new NodeCache()
const cacheTTL = 60

const convertToPresentationArticle = (article: Article) => {
  const presentationArticle: PresentationArticle = {
    ...article,
    date: formatDate(article.date),
    last_updated: article.last_updated
      ? formatDate(article.last_updated)
      : undefined,
  }

  return presentationArticle
}

export const getArticle = async (
  repo: ArticleRepository,
  id: string,
): Promise<
  Result<
    PresentationArticle,
    NotFoundError | UnexpectedBehaviorDetectedError | Error
  >
> => {
  const cacheKey = id

  const cached = cache.get<PresentationArticle>(cacheKey)
  if (cached) {
    return new Success(cached)
  }

  const result = await repo.getArticle(id)
  if (result.success) {
    const presentationArticle = convertToPresentationArticle(result.data!)
    cache.set(cacheKey, presentationArticle, cacheTTL)
    return new Success(presentationArticle)
  }

  const errorId = result.error?.id
  const errorMsg = result.error?.message

  if (errorId === 'not-exists') {
    return new Failure(
      new NotFoundError(
        concatErrorMessages(`Article "${id}" not found`, errorMsg),
      ),
    )
  } else if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(
        concatErrorMessages(
          `Too many rows selected while fetching article "${id}"`,
          errorMsg,
        ),
      ),
    )
  }

  return new Failure(
    new Error(concatErrorMessages(`Failed to get article "${id}"`, errorMsg)),
  )
}

export const flushGetCache: FlushCacheFunction = async (id: string) => {
  cache.del(id)
}
