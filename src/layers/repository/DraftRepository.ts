import { Draft } from '../entity/types'
import {
  DeleteDraftReturnProps,
  deleteDraft,
} from './mariadb/draft/delete/deleteDraft'
import { GetDraftReturnProps, getDraft } from './mariadb/draft/get/getDraft'
import { SaveDraftReturnProps, saveDraft } from './mariadb/draft/save/saveDraft'
import {
  GetDraftForPreviewReturnProps,
  getDraftForPreview,
} from './ram/draft/getPreview/getDraftForPreview'
import {
  SetDraftForPreviewReturnProps,
  setDraftForPreview,
} from './ram/draft/setPreview/setDraftForPreview'

export interface DraftRepository {
  saveDraft(_draft: Draft): Promise<SaveDraftReturnProps>
  getDraft(_id: string): Promise<GetDraftReturnProps>
  deleteDraft(_id: string): Promise<DeleteDraftReturnProps>

  setDraftForPreview(_draft: Draft): Promise<SetDraftForPreviewReturnProps>
  getDraftForPreview(_id: string): Promise<GetDraftForPreviewReturnProps>
}

export const getRepository = (): DraftRepository => {
  return {
    saveDraft,
    getDraft,
    deleteDraft,

    setDraftForPreview,
    getDraftForPreview,
  }
}
