import { NextRequest, NextResponse } from 'next/server'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { Draft } from '@/layers/entity/types'
import {
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const result = await getDraftUseCase().getDraft(id)

  if (result.isFailure()) {
    if (result.error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (result.error instanceof UnexpectedBehaviorDetectedError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json(result.value)
}

export async function POST(request: NextRequest, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const data: Draft = await request.json()

  data.id = id

  const result = await getDraftUseCase().saveDraft(data)

  if (result.isFailure()) {
    if (result.error instanceof InvalidDataError) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const result = await getDraftUseCase().deleteDraft(id)

  if (result.isFailure()) {
    if (result.error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
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
