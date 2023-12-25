import { Failure, Result, Success } from '@/lib/utils/Result'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import { DraftExcessiveScopeError, DraftNotFoundError } from '../errors'

export const deleteDraft = async (
  repo: DraftRepository,
  id: string,
): Promise<
  Result<true, DraftNotFoundError | DraftExcessiveScopeError | Error>
> => {
  const result = await repo.deleteDraft(id)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new DraftNotFoundError(`Draft not found: ${id}`))
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new DraftExcessiveScopeError(`Too many rows deleted: ${id}`),
    )
  }

  return new Failure(
    new Error(`Failed to delete draft: ${result.error?.message}`),
  )
}
