import { Draft } from '@/layers/entity/types'
import NodeCache from 'node-cache'

const cache = new NodeCache()

export const getData = (key: string): Draft | null => {
  const draft: Draft | undefined = cache.get(key)
  if (draft !== undefined) {
    return draft
  }

  return null
}

export const setData = (key: string, data: Draft): boolean => {
  return cache.set(key, data)
}
