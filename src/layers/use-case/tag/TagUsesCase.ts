import { TagUseCase } from './interface'
import { TagRepository, getRepository } from '@/layers/repository/TagRepository'
import { createTag } from './create/createTag'
import { deleteTag } from './delete/deleteTag'
import { listTags } from './list/listTags'

const createUseCase = (repo: TagRepository): TagUseCase => {
  return {
    createTag: async (tag: string) => createTag(repo, tag),
    deleteTag: async (tag: string) => deleteTag(repo, tag),
    listTags: async () => listTags(repo),
  }
}

export const getTagUseCase = (): TagUseCase => {
  const repository: TagRepository = getRepository()

  return createUseCase(repository)
}
