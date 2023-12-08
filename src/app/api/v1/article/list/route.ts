import { NextRequest, NextResponse } from 'next/server'
import { sha256 } from '@/lib/utils'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import {
  queryAllArticles,
  queryWithTags,
} from '@/lib/database/ArticleListQuery'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []
  let page: number = Number(searchParams.get('page')) ?? -1

  if (page < 1) {
    page = 1
  }

  const userEmailHash = sha256(session.user.email)

  if (tags.length > 0) {
    const data = await queryWithTags(userEmailHash, tags, page)
    return NextResponse.json(data)
  } else {
    const data = await queryAllArticles(userEmailHash, page)
    return NextResponse.json(data)
  }
}
