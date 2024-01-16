import { Failure, Result, Success } from '@/lib/utils/Result'
import { Draft } from '@/layers/entity/types'
import { DraftRepository } from '@/layers/repository/DraftRepository'
import { InvalidDataError } from '@/layers/entity/errors'

export const saveDraft = async (
  repo: DraftRepository,
  draft: Draft,
): Promise<Result<true, InvalidDataError | Error>> => {
  const result = await repo.saveDraft(draft)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'invalid-data') {
    return new Failure(new InvalidDataError(`Invalid draft data`))
  }

  return new Failure(
    new Error(`Failed to save draft: ${result.error?.message}`),
  )
}
