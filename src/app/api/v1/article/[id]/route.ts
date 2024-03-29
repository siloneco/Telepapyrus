import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import { PublishableDraft } from '@/layers/entity/types'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import {
  AlreadyExistsError,
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

type RequestJson = PublishableDraft & { update?: boolean }

export async function GET(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const result = await getArticleUseCase().getArticle(id)

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

  const article = result.value

  return NextResponse.json(article)
}

export async function POST(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: RequestJson = await request.json()
  data.id = params.id

  if (data.update === undefined || data.update === false) {
    const result = await getArticleUseCase().createArticle(data)

    if (result.isFailure()) {
      const error = result.error

      if (error instanceof AlreadyExistsError) {
        return NextResponse.json({ error: 'Already Exists' }, { status: 409 })
      } else if (error instanceof InvalidDataError) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    // Delete draft
    const _ignoreResult = await getDraftUseCase().deleteDraft(data.id)

    return NextResponse.json({ status: 'OK' })
  } else {
    const result = await getArticleUseCase().updateArticle(data)

    if (result.isFailure()) {
      const error = result.error

      if (error instanceof NotFoundError) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 })
      } else if (error instanceof InvalidDataError) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    // Delete draft
    const _ignoreResult = await getDraftUseCase().deleteDraft(data.id)

    return NextResponse.json({ status: 'OK' })
  }
}

export async function DELETE(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const result = await getArticleUseCase().deleteArticle(id)

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

  return NextResponse.json({ status: 'OK' })
}
