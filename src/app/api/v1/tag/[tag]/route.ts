import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'
import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    tag: string
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tag } = params

  const result = await getTagUseCase().createTag(tag)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof AlreadyExistsError) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 })
    } else if (error instanceof InvalidDataError) {
      return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const responseData = {
    status: 'ok',
  }

  return NextResponse.json(responseData, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tag } = params

  const result = await getTagUseCase().deleteTag(tag)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (error instanceof UnexpectedBehaviorDetectedError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
