import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import {
  ArticleAlreadyExistsError,
  ArticleExcessiveScopeError,
  ArticleInvalidDataError,
  ArticleNotFoundError,
} from '@/layers/use-case/article/errors'
import { Draft } from '@/layers/entity/types'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const { id } = params

  const result = await getArticleUseCase().getArticle(id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleNotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (error instanceof ArticleExcessiveScopeError) {
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
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: Draft = await request.json()
  data.id = params.id

  const result = await getArticleUseCase().createArticle(data)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleAlreadyExistsError) {
      return NextResponse.json({ error: 'Already Exists' }, { status: 409 })
    } else if (error instanceof ArticleInvalidDataError) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'OK' })
}

export async function DELETE(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const result = await getArticleUseCase().deleteArticle(id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleNotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (error instanceof ArticleExcessiveScopeError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'OK' })
}
