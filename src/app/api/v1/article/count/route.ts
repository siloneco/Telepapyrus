import { NextRequest, NextResponse } from 'next/server'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import {
  ArticleExcessiveScopeError,
  ArticleUnexpectedReturnValueError,
} from '@/layers/use-case/article/errors'
import NodeCache from 'node-cache'

export const dynamic = 'force-dynamic'

const cache = new NodeCache()
const cacheTTL = 10 // seconds

type ReturnProps = {
  count: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] | undefined =
    searchParams.get('tags')?.split(',') ?? undefined

  if (tags) {
    for (const tag of tags) {
      if (tag.length > TAG_NAME_MAX_LENGTH) {
        return NextResponse.json(
          { error: `Tag name is too long (max ${TAG_NAME_MAX_LENGTH} chars)` },
          { status: 400 },
        )
      }
    }
  }

  const cacheKey = tags ? tags.join(',') : ''
  const cachedValue = cache.get(cacheKey)
  if (cachedValue !== undefined) {
    return NextResponse.json(cachedValue)
  }

  const result = await getArticleUseCase().countArticle(tags)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleExcessiveScopeError) {
      // pass
    } else if (error instanceof ArticleUnexpectedReturnValueError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const returnData: ReturnProps = {
    count: result.value,
  }

  cache.set(cacheKey, returnData, cacheTTL)

  return NextResponse.json(returnData)
}
