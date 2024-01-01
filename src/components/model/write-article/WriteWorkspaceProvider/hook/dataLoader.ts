import { Draft } from '@/layers/entity/types'
import { WriteWorkspaceMode } from '../../WriteWorkspace'
import { getBaseURL } from '../logic'
import { PresentationArticle } from '@/layers/use-case/article/ArticleUseCase'
import { PresentationDraft } from '@/layers/use-case/draft/DraftUsesCase'

const loadDataFromDraft = async (id: string): Promise<Draft | null> => {
  const res = await fetch(`${getBaseURL()}/api/v1/draft/${id}`)

  if (res.status !== 200) {
    return null
  }

  const data: PresentationDraft = await res.json()

  const result: Draft = {
    id: data.id,
    title: data.title,
    content: data.content,
    tags: [],
    public: true,
  }

  return result
}

const loadDataFromArticle = async (id: string): Promise<Draft | null> => {
  const res = await fetch(`${getBaseURL()}/api/v1/article/${id}`)

  if (res.status !== 200) {
    return null
  }

  const data: PresentationArticle = await res.json()

  const result: Draft = {
    id: data.id,
    title: data.title,
    content: data.content,
    tags: data.tags,
    public: true,
  }

  return result
}

type Props = {
  mode: WriteWorkspaceMode
  id: string
}

export const loadData = ({ mode, id }: Props): Promise<Draft | null> => {
  if (mode === 'write-draft') {
    return loadDataFromDraft(id)
  } else if (mode === 'edit-article') {
    return new Promise(async (resolve) => {
      const draft: Draft | null = await loadDataFromDraft(id)

      if (draft) {
        resolve(draft)
        return
      }

      resolve(await loadDataFromArticle(id))
    })
  }

  return Promise.resolve(null)
}
