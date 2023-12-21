import { Draft } from '../../entity/types'
import {
  ArticleRepository,
  getRepository,
} from '../../repository/ArticleRepository'
import { createArticle } from './create/createArticle'
import { deleteArticle } from './delete/deleteArticle'
import { getArticle } from './get/getArticle'
import { updateArticle } from './update/updateArticle'
import { listArticle } from './list/listArticle'
import { ArticleUseCase } from './interface'

export type PresentationArticle = {
  id: string
  title: string
  content: string
  tags: string[]
  date: string
  last_updated: string | null
}

export type ListArticleProps = {
  tags?: string[]
  page?: number
}

const createUseCase = (repo: ArticleRepository): ArticleUseCase => {
  return {
    createArticle: async (draft: Draft) => await createArticle(repo, draft),
    getArticle: async (id: string) => await getArticle(repo, id),
    updateArticle: async (draft: Draft) => await updateArticle(repo, draft),
    deleteArticle: async (id: string) => await deleteArticle(repo, id),
    listArticle: async (data) => await listArticle(repo, data),
  }
}

export const getArticleUseCase = (): ArticleUseCase => {
  const repository: ArticleRepository = getRepository()

  return createUseCase(repository)
}
