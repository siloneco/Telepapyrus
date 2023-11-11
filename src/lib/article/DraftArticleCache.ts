import { Draft } from '@/components/types/Post'

const map = new Map<string, Draft>()

const setDraftData = async (data: Draft) => {
  map.set(data.id, data)
}

const getDraftData = async (id: string) => {
  return map.get(id)
}

export { setDraftData, getDraftData }
