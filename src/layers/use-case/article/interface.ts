import { PublishableDraft } from '../../entity/types'
import {
  ListArticleProps,
  PresentationArticle,
  PresentationArticleOverview,
} from './ArticleUseCase'
import {
  ArticleAlreadyExistsError,
  ArticleExcessiveScopeError,
  ArticleInvalidDataError,
  ArticleNotFoundError,
  ArticleUnexpectedReturnValueError,
} from './errors'
import { Result } from '@/lib/utils/Result'

export interface ArticleUseCase {
  createArticle(
    _draft: PublishableDraft,
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
    _draft: PublishableDraft,
  ): Promise<
    Result<true, ArticleInvalidDataError | ArticleNotFoundError | Error>
  >
  deleteArticle(
    _id: string,
  ): Promise<
    Result<true, ArticleNotFoundError | ArticleExcessiveScopeError | Error>
  >

  countArticle(
    _tags?: string[],
  ): Promise<
    Result<
      number,
      ArticleExcessiveScopeError | ArticleUnexpectedReturnValueError | Error
    >
  >
  listArticle(
    _data: ListArticleProps,
  ): Promise<Result<PresentationArticleOverview[], Error>>
}
