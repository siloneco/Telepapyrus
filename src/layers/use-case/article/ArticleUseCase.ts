import { Article, ArticleOverview, PublishableDraft } from '../../entity/types'
import {
  ArticleRepository,
  getRepository,
} from '../../repository/ArticleRepository'
import { createArticle } from './create/createArticle'
import { deleteArticle } from './delete/deleteArticle'
import { flushGetCache, getArticle } from './get/getArticle'
import { updateArticle } from './update/updateArticle'
import { flushListCache, listArticle } from './list/listArticle'
import { ArticleUseCase } from './interface'
import { countArticle, flushCountCache } from './count/countArticle'
import { Result } from '@/lib/utils/Result'

const flushCachesIfSuccess = (
  result: Result<any, any>,
  flushCacheFunctions: FlushCacheFunction[],
  id: string,
) => {
  if (result.isSuccess()) {
    // no await
    Promise.all(flushCacheFunctions.map((fn) => fn(id)))
  }
}

export type PresentationArticle = Omit<
  Article,
  'date' | 'last_updated' | 'isPublic'
> & {
  date: string
  last_updated?: string
}

export type PresentationArticleOverview = Omit<
  ArticleOverview,
  'date' | 'last_updated'
> & {
  date: string
  last_updated?: string
}

export type ListArticleProps = {
  tags?: string[]
  page?: number
}

export type FlushCacheFunction = (_id: string) => Promise<void>

const createUseCase = (repo: ArticleRepository): ArticleUseCase => {
  const flushCacheFunctions: FlushCacheFunction[] = [
    flushCountCache,
    flushListCache,
    flushGetCache,
  ]

  return {
    createArticle: async (draft: PublishableDraft) => {
      const result = await createArticle(repo, draft)
      flushCachesIfSuccess(result, flushCacheFunctions, draft.id)
      return result
    },
    updateArticle: async (draft: PublishableDraft) => {
      const result = await updateArticle(repo, draft)
      flushCachesIfSuccess(result, flushCacheFunctions, draft.id)
      return result
    },
    deleteArticle: async (id: string) => {
      const result = await deleteArticle(repo, id)
      flushCachesIfSuccess(result, flushCacheFunctions, id)
      return result
    },
    getArticle: async (id: string) => await getArticle(repo, id),
    countArticle: async (tags?: string[]) => await countArticle(repo, tags),
    listArticle: async (data: ListArticleProps) =>
      await listArticle(repo, data),
  }
}

export const getArticleUseCase = (): ArticleUseCase => {
  const repository: ArticleRepository = getRepository()

  return createUseCase(repository)
}
