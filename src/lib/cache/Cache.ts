const crypto = require('crypto')

const defaultRevalidate: number = 60

const cache = new Map<string, Map<string, any>>()
const expire = new Map<string, Map<string, number>>()

const hash = async (text: string): Promise<string> => {
  return crypto.createHash('md5').update(text).digest('hex')
}

export async function reuseComponent<T, U>(
  id: string,
  data: T,
  generate: (_: T) => Promise<U>,
  options: {
    revalidate?: number
  } = {},
): Promise<() => Promise<U>> {
  // Get or initialize map
  let map: Map<string, any> = cache.get(id) || new Map<string, any>()
  if (!cache.has(id)) {
    cache.set(id, map)
  }

  let expireMap: Map<string, number> =
    expire.get(id) || new Map<string, number>()
  if (!expire.has(id)) {
    expire.set(id, expireMap)
  }

  // Get key
  const key = await hash(JSON.stringify(data))

  // Check if cache hit
  const now = Date.now()
  const expireAt = expireMap.get(key)
  const cacheHit = map.has(key) && expireAt && expireAt > now

  // Return cached value
  if (cacheHit) {
    return async () => map.get(key)
  }

  // Otherwise, call function and cache result
  const result = await generate(data)
  map.set(key, result)
  expireMap.set(key, now + (options.revalidate || defaultRevalidate) * 1000)
  return async () => result
}
