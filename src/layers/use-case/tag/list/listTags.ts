import { Failure, Result, Success } from '@/lib/utils/Result'
import { TagRepository } from '@/layers/repository/TagRepository'

export const listTags = async (
  repo: TagRepository,
): Promise<Result<string[], Error>> => {
  const result = await repo.listTags()
  if (result.success) {
    return new Success(result.data!)
  }

  return new Failure(new Error(`Failed to get draft: ${result.error?.message}`))
}
