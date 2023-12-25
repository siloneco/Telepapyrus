import { Failure, Result, Success } from '@/lib/utils/Result'
import { PresentationDraft } from '../DraftUsesCase'
import { Draft } from '@/layers/entity/types'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import { DraftNotFoundError } from '../errors'

const convertToPresentationDraft = (draft: Draft) => {
  const presentationDraft: PresentationDraft = {
    ...draft,
  }

  return presentationDraft
}

export const getDraftForPreview = async (
  repo: DraftRepository,
  id: string,
): Promise<Result<PresentationDraft, DraftNotFoundError | Error>> => {
  const result = await repo.getDraftForPreview(id)
  if (result.success) {
    const presentationDraft = convertToPresentationDraft(result.data!)
    return new Success(presentationDraft)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(
      new DraftNotFoundError(`Draft for preview not found: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to get draft for preview: ${result.error?.message}`),
  )
}
