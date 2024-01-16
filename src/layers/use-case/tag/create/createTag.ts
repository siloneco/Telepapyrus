import { Failure, Result, Success } from '@/lib/utils/Result'
import { TagRepository } from '@/layers/repository/TagRepository'
import { AlreadyExistsError, InvalidDataError } from '@/layers/entity/errors'

export const createTag = async (
  repo: TagRepository,
  tag: string,
): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>> => {
  const result = await repo.createTag(tag)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'already-exists') {
    return new Failure(new AlreadyExistsError(`Tag already exists: ${tag}`))
  } else if (errorId === 'invalid-data') {
    return new Failure(new InvalidDataError(`Invalid tag name`))
  }

  return new Failure(
    new Error(`Failed to create tag: ${result.error?.message}`),
  )
}
