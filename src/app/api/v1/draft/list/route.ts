import { NextRequest, NextResponse } from 'next/server'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const tmpPage = Number(searchParams.get('page'))

  if (searchParams.has('page') && tmpPage < 1) {
    return NextResponse.json(
      { error: 'Page number must be greater than or equal to 1' },
      { status: 400 },
    )
  }

  const page: number = tmpPage !== Number.NaN ? tmpPage : 1

  const result = await getDraftUseCase().listDraft(page)

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const resultData = result.value
  return NextResponse.json(resultData)
}
