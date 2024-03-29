import {
  DraftRepository,
  getRepository,
} from '@/layers/repository/DraftRepository'
import { DraftUseCase } from './interface'
import { getDraft } from './get/getDraft'
import { saveDraft } from './save/saveDraft'
import { Draft } from '@/layers/entity/types'
import { setDraftForPreview } from './setForPreview/setDraftForPreview'
import { getDraftForPreview } from './getForPreview/getForPreview'
import { deleteDraft } from './delete/deleteDraft'
import { listDraft } from './list/listDraft'
import { changeDraftId } from './changeId/changeDraftId'

export type PresentationDraft = {
  id: string
  title: string
  content: string
}

const createUseCase = (repo: DraftRepository): DraftUseCase => {
  return {
    getDraft: async (id: string) => getDraft(repo, id),
    saveDraft: async (draft: Draft) => saveDraft(repo, draft),
    deleteDraft: async (id: string) => deleteDraft(repo, id),
    listDraft: async (page?: number) => listDraft(repo, page),
    changeDraftId: async (oldId: string, newId: string) =>
      changeDraftId(repo, oldId, newId),

    setDraftForPreview: async (draft: Draft) => setDraftForPreview(repo, draft),
    getDraftForPreview: async (id: string) => getDraftForPreview(repo, id),
  }
}

export const getDraftUseCase = (): DraftUseCase => {
  const repository: DraftRepository = getRepository()

  return createUseCase(repository)
}
