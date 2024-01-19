import { Failure, Result, Success } from '@/lib/utils/Result'
import { DraftOverview } from '@/layers/entity/types'
import { DraftRepository } from '@/layers/repository/DraftRepository'

export const listDraft = async (
  repo: DraftRepository,
  page?: number,
): Promise<Result<DraftOverview[], Error>> => {
  const result = await repo.listDraft(page)
  if (result.success) {
    return new Success(result.data!)
  }

  return new Failure(
    new Error(`Failed to list draft: ${result.error?.message}`),
  )
}
