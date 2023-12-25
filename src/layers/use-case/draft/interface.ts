import { Draft } from '../../entity/types'
import { Result } from '@/lib/utils/Result'
import {
  DraftExcessiveScopeError,
  DraftInvalidDataError,
  DraftNotFoundError,
} from './errors'
import { PresentationDraft } from './DraftUsesCase'

export interface DraftUseCase {
  saveDraft(_draft: Draft): Promise<Result<true, DraftInvalidDataError | Error>>
  getDraft(
    _id: string,
  ): Promise<
    Result<
      PresentationDraft,
      DraftNotFoundError | DraftExcessiveScopeError | Error
    >
  >
  deleteDraft(
    _id: string,
  ): Promise<
    Result<true, DraftNotFoundError | DraftExcessiveScopeError | Error>
  >

  setDraftForPreview(_draft: Draft): Promise<Result<true, Error>>
  getDraftForPreview(
    _id: string,
  ): Promise<Result<PresentationDraft, DraftNotFoundError | Error>>
}
