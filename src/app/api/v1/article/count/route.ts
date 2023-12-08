import { NextRequest, NextResponse } from 'next/server'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { sha256 } from '@/lib/utils'
import { countArticle } from '@/lib/database/ArticleCountQuery'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []

  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  for (const tag of tags) {
    if (tag.length > TAG_NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Tag name is too long (max ${TAG_NAME_MAX_LENGTH} chars)` },
        { status: 400 },
      )
    }
  }

  const userEmailHash = sha256(session.user.email)

  const data = await countArticle(userEmailHash, tags)

  if (data === null) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
