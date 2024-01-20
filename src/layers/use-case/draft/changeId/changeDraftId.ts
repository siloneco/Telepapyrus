import { Failure, Result, Success } from '@/lib/utils/Result'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const changeDraftId = async (
  repo: DraftRepository,
  oldId: string,
  newId: string,
): Promise<
  Result<
    true,
    | NotFoundError
    | AlreadyExistsError
    | UnexpectedBehaviorDetectedError
    | InvalidDataError
    | Error
  >
> => {
  const result = await repo.changeDraftId(oldId, newId)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(
      new NotFoundError(`Draft with old id not found: ${oldId} -> ${newId}`),
    )
  } else if (errorId === 'already-exists') {
    return new Failure(
      new AlreadyExistsError(`New ID already occupied: ${oldId} -> ${newId}`),
    )
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new UnexpectedBehaviorDetectedError(
        `Too many rows affected: ${oldId} -> ${newId}`,
      ),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(
      new InvalidDataError(`Invalid data: ${oldId} -> ${newId}`),
    )
  }

  return new Failure(
    new Error(`Failed to change draft id: ${result.error?.message}`),
  )
}
