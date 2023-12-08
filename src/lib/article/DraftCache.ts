import { Draft } from '@/components/types/Article'

const map = new Map<string, Draft>()

const setDraftData = async (user: string, data: Draft) => {
  map.set(user + data.id, data)
}

const getDraftData = async (user: string, id: string) => {
  return map.get(user + id)
}

export { setDraftData, getDraftData }
