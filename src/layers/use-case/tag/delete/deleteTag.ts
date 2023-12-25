import { TagRepository } from '@/layers/repository/TagRepository'
import { Failure, Result, Success } from '@/lib/utils/Result'
import { TagExcessiveScopeError, TagNotFoundError } from '../errors'

export const deleteTag = async (
  repo: TagRepository,
  tag: string,
): Promise<Result<true, TagNotFoundError | TagExcessiveScopeError | Error>> => {
  const result = await repo.deleteTag(tag)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(new TagNotFoundError(`Tag not found: ${tag}`))
  } else if (errorId === 'too-many-rows-affected') {
    return new Failure(
      new TagExcessiveScopeError(`Too many rows deleted: ${tag}`),
    )
  }

  return new Failure(
    new Error(`Failed to delete tag: ${result.error?.message}`),
  )
}
