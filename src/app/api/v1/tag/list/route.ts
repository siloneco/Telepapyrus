import { NextResponse } from 'next/server'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'
import NodeCache from 'node-cache'

export const dynamic = 'force-dynamic'

const cache = new NodeCache()
const cacheTTL = 10 // second

export async function GET(_req: Request) {
  const cacheKey = 'key'
  const cachedValue = cache.get(cacheKey)
  if (cachedValue !== undefined) {
    return NextResponse.json(cachedValue)
  }

  const result = await getTagUseCase().listTags()

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const tags = result.value

  cache.set(cacheKey, tags, cacheTTL)

  return NextResponse.json(tags, { status: 200 })
}
