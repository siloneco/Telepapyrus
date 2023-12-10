import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftCache'
import { Draft } from '@/components/types/Article'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

import { sha256 } from '@/lib/utils'
import {
  ARTICLE_CONTENT_MAX_LENGTH,
  ARTICLE_ID_MAX_LENGTH,
  ARTICLE_TITLE_MAX_LENGTH,
} from '@/lib/constants/Constants'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const data: Draft = await request.json()

  if (data.id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  } else if (data.title.length > ARTICLE_TITLE_MAX_LENGTH) {
    return NextResponse.json({ error: 'Title too long' }, { status: 400 })
  } else if (data.content.length > ARTICLE_CONTENT_MAX_LENGTH) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 })
  }

  await setDraftData(userEmailHash, data)
  return new Response(null, { status: 204 })
}
