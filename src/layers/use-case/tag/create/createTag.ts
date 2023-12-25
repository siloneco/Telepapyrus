import { Failure, Result, Success } from '@/lib/utils/Result'
import { TagAlreadyExistsError, TagInvalidDataError } from '../errors'
import { TagRepository } from '@/layers/repository/TagRepository'

export const createTag = async (
  repo: TagRepository,
  tag: string,
): Promise<
  Result<true, TagAlreadyExistsError | TagInvalidDataError | Error>
> => {
  const result = await repo.createTag(tag)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'already-exists') {
    return new Failure(new TagAlreadyExistsError(`Tag already exists: ${tag}`))
  } else if (errorId === 'invalid-data') {
    return new Failure(new TagInvalidDataError(`Invalid tag name`))
  }

  return new Failure(
    new Error(`Failed to create tag: ${result.error?.message}`),
  )
}
