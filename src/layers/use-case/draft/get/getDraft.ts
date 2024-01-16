import { Failure, Result, Success } from '@/lib/utils/Result'
import { PresentationDraft } from '../DraftUsesCase'
import { Draft } from '@/layers/entity/types'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import {
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

const convertToPresentationDraft = (draft: Draft) => {
  const presentationDraft: PresentationDraft = {
    ...draft,
  }

  return presentationDraft
}

export const getDraft = async (
  repo: DraftRepository,
  id: string,
): Promise<
  Result<
    PresentationDraft,
    NotFoundError | UnexpectedBehaviorDetectedError | Error
  >
> => {
  const result = await repo.getDraft(id)
  if (result.success) {
    const presentationDraft = convertToPresentationDraft(result.data!)
    return new Success(presentationDraft)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new NotFoundError(`Draft not found: ${id}`))
  } else if (errorId === 'too-many-rows-selected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(`Too many rows selected: ${id}`),
    )
  }

  return new Failure(new Error(`Failed to get draft: ${result.error?.message}`))
}
