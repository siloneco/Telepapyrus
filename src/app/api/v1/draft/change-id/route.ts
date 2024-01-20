import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const dynamic = 'force-dynamic'

export type ChangeDraftIdRequestProps = {
  oldId: string
  newId: string
}

export async function POST(request: Request) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: ChangeDraftIdRequestProps = await request.json()

  if (
    data.oldId === undefined ||
    data.newId === undefined ||
    data.oldId === data.newId
  ) {
    return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
  }

  const result = await getDraftUseCase().changeDraftId(data.oldId, data.newId)

  if (result.isFailure()) {
    if (result.error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (result.error instanceof AlreadyExistsError) {
      return NextResponse.json({ error: 'Already Exists' }, { status: 409 })
    } else if (result.error instanceof InvalidDataError) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
    } else if (result.error instanceof UnexpectedBehaviorDetectedError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
