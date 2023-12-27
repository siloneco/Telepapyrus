import { TagUseCase } from './interface'
import { TagRepository, getRepository } from '@/layers/repository/TagRepository'
import { createTag } from './create/createTag'
import { deleteTag } from './delete/deleteTag'
import { flushListCache, listTags } from './list/listTags'
import { Result } from '@/lib/utils/Result'

type FlushCacheFunction = (_tag: string) => Promise<void>

const flushCacheIfSuccess = async (
  result: Result<any, any>,
  fns: FlushCacheFunction[],
  tag: string,
): Promise<void> => {
  if (result.isSuccess()) {
    // no await
    Promise.all(fns.map((fn) => fn(tag)))
  }
}

const createUseCase = (repo: TagRepository): TagUseCase => {
  const flushCacheFunctions: FlushCacheFunction[] = [flushListCache]

  return {
    createTag: async (tag: string) => {
      const result = await createTag(repo, tag)
      await flushCacheIfSuccess(result, flushCacheFunctions, tag)
      return result
    },
    deleteTag: async (tag: string) => {
      const result = await deleteTag(repo, tag)
      await flushCacheIfSuccess(result, flushCacheFunctions, tag)
      return result
    },
    listTags: async () => listTags(repo),
  }
}

export const getTagUseCase = (): TagUseCase => {
  const repository: TagRepository = getRepository()

  return createUseCase(repository)
}
