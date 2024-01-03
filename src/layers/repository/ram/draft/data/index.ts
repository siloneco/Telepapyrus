import { Draft } from '@/layers/entity/types'
import NodeCache from 'node-cache'

const cache = new NodeCache()

export const getData = (key: string): Draft | null => {
  return cache.get<Draft>(key) ?? null
}

export const setData = (key: string, data: Draft): boolean => {
  return cache.set<Draft>(key, data)
}
