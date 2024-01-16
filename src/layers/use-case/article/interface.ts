import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'
import { PublishableDraft } from '../../entity/types'
import {
  ListArticleProps,
  PresentationArticle,
  PresentationArticleOverview,
} from './ArticleUseCase'
import { Result } from '@/lib/utils/Result'

export interface ArticleUseCase {
  createArticle(
    _draft: PublishableDraft,
  ): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>>
  getArticle(
    _id: string,
  ): Promise<
    Result<
      PresentationArticle,
      NotFoundError | UnexpectedBehaviorDetectedError | Error
    >
  >
  updateArticle(
    _draft: PublishableDraft,
  ): Promise<Result<true, InvalidDataError | NotFoundError | Error>>
  deleteArticle(
    _id: string,
  ): Promise<
    Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
  >

  countArticle(
    _tags?: string[],
  ): Promise<Result<number, UnexpectedBehaviorDetectedError | Error>>
  listArticle(
    _data: ListArticleProps,
  ): Promise<Result<PresentationArticleOverview[], Error>>
}
