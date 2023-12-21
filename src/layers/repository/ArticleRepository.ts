import { Draft } from '../entity/types'
import {
  CreateArticleReturnProps,
  createArticle,
} from './mariadb/create/createArticle'
import {
  DeleteArticleReturnProps,
  deleteArticle,
} from './mariadb/delete/deleteArticle'
import { GetArticleReturnProps, getArticle } from './mariadb/get/getArticle'
import {
  ListArticleProps,
  ListArticleReturnProps,
  listArticle,
} from './mariadb/list/listArticle'
import {
  UpdateArticleReturnProps,
  updateArticle,
} from './mariadb/update/updateArticle'

export interface ArticleRepository {
  createArticle(_draft: Draft): Promise<CreateArticleReturnProps>
  getArticle(_id: string): Promise<GetArticleReturnProps>
  updateArticle(_draft: Draft): Promise<UpdateArticleReturnProps>
  deleteArticle(_id: string): Promise<DeleteArticleReturnProps>

  listArticle(_props: ListArticleProps): Promise<ListArticleReturnProps>
}

export const getRepository = (): ArticleRepository => {
  return {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    listArticle,
  }
}
