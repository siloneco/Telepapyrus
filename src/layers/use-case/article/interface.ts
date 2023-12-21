import { Draft } from '../../entity/types'
import { ListArticleProps, PresentationArticle } from './ArticleUseCase'
import {
  ArticleAlreadyExistsError,
  ArticleExcessiveScopeError,
  ArticleInvalidDataError,
  ArticleNotFoundError,
} from './errors'
import { Result } from '@/lib/utils/Result'

export interface ArticleUseCase {
  createArticle(
    _draft: Draft,
  ): Promise<
    Result<true, ArticleAlreadyExistsError | ArticleInvalidDataError | Error>
  >
  getArticle(
    _id: string,
  ): Promise<
    Result<
      PresentationArticle,
      ArticleNotFoundError | ArticleExcessiveScopeError | Error
    >
  >
  updateArticle(
    _draft: Draft,
  ): Promise<
    Result<true, ArticleInvalidDataError | ArticleNotFoundError | Error>
  >
  deleteArticle(
    _id: string,
  ): Promise<
    Result<true, ArticleNotFoundError | ArticleExcessiveScopeError | Error>
  >

  listArticle(
    _data: ListArticleProps,
  ): Promise<
    Result<
      PresentationArticle[],
      ArticleNotFoundError | ArticleExcessiveScopeError | Error
    >
  >
}
