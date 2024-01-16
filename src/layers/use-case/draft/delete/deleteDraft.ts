import { Failure, Result, Success } from '@/lib/utils/Result'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import {
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const deleteDraft = async (
  repo: DraftRepository,
  id: string,
): Promise<
  Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
> => {
  const result = await repo.deleteDraft(id)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new NotFoundError(`Draft not found: ${id}`))
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(`Too many rows deleted: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to delete draft: ${result.error?.message}`),
  )
}
