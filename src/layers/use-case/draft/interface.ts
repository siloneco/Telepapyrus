import { Draft } from '../../entity/types'
import { Result } from '@/lib/utils/Result'
import { PresentationDraft } from './DraftUsesCase'
import {
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export interface DraftUseCase {
  saveDraft(_draft: Draft): Promise<Result<true, InvalidDataError | Error>>
  getDraft(
    _id: string,
  ): Promise<
    Result<
      PresentationDraft,
      NotFoundError | UnexpectedBehaviorDetectedError | Error
    >
  >
  deleteDraft(
    _id: string,
  ): Promise<
    Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
  >

  setDraftForPreview(_draft: Draft): Promise<Result<true, Error>>
  getDraftForPreview(
    _id: string,
  ): Promise<Result<PresentationDraft, NotFoundError | Error>>
}
