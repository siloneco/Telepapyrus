import { NextRequest, NextResponse } from 'next/server'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []

  for (const tag of tags) {
    if (tag.length > TAG_NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Tag name is too long (max ${TAG_NAME_MAX_LENGTH} chars)` },
        { status: 400 },
      )
    }
  }

  const numberedPage = Number(searchParams.get('page'))
  if (searchParams.has('page') && numberedPage < 1) {
    return NextResponse.json(
      { error: 'Page number must be greater than or equal to 1' },
      { status: 400 },
    )
  }

  const page: number =
    numberedPage !== Number.NaN ? Math.max(1, numberedPage) : 1

  const listArticleArgTags = tags.length > 0 ? tags : undefined

  const result = await getArticleUseCase().listArticle({
    page,
    tags: listArticleArgTags,
    includePrivateArticles: false,
  })

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const resultData = result.value
  return NextResponse.json(resultData)
}
