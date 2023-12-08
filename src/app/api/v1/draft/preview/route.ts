import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftCache'
import { Draft } from '@/components/types/Article'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const data: Draft = await request.json()
  await setDraftData(userEmailHash, data)
  return new Response(null, { status: 204 })
}
