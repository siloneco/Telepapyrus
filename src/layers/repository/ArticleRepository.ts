import { Draft } from '../entity/types'
import {
  CountArticleReturnProps,
  countArticle,
} from './mariadb/article/count/countArticle'
import {
  CreateArticleReturnProps,
  createArticle,
} from './mariadb/article/create/createArticle'
import {
  DeleteArticleReturnProps,
  deleteArticle,
} from './mariadb/article/delete/deleteArticle'
import {
  GetArticleReturnProps,
  getArticle,
} from './mariadb/article/get/getArticle'
import {
  ListArticleProps,
  ListArticleReturnProps,
  listArticle,
} from './mariadb/article/list/listArticle'
import {
  UpdateArticleReturnProps,
  updateArticle,
} from './mariadb/article/update/updateArticle'

export interface ArticleRepository {
  createArticle(_draft: Draft): Promise<CreateArticleReturnProps>
  getArticle(_id: string): Promise<GetArticleReturnProps>
  updateArticle(_draft: Draft): Promise<UpdateArticleReturnProps>
  deleteArticle(_id: string): Promise<DeleteArticleReturnProps>

  countArticle(_tags?: string[]): Promise<CountArticleReturnProps>
  listArticle(_props: ListArticleProps): Promise<ListArticleReturnProps>
}

export const getRepository = (): ArticleRepository => {
  return {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    countArticle,
    listArticle,
  }
}
