import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { Draft } from '@/components/types/Article'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { sha256 } from '@/lib/utils'
import {
  ARTICLE_CONTENT_MAX_LENGTH,
  ARTICLE_ID_MAX_LENGTH,
  ARTICLE_TITLE_MAX_LENGTH,
  MAX_ARTICLE_COUNT_PER_USER,
} from '@/lib/constants/Constants'
import { countDraft } from '@/lib/database/DraftCountQuery'

export const dynamic = 'force-dynamic'

const getQuery = `
SELECT id, title, content FROM drafts WHERE user = ? AND id = ?;
`

const postQuery = `
INSERT INTO drafts (user, id, title, content) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content);
`

const deleteQuery = `
DELETE FROM drafts WHERE user = ? AND id = ?;
`

async function getConnection(): Promise<PoolConnection> {
  return await new Promise((resolve, reject) => {
    getConnectionPool().then((connectionPool: Pool) => {
      connectionPool.getConnection(
        (error: NodeJS.ErrnoException | null, connection: PoolConnection) => {
          if (error) {
            reject(error)
          }
          resolve(connection)
        },
      )
    })
  })
}

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const userEmailHash = sha256(session.user.email)

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        getQuery,
        [userEmailHash, id],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (results.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    if (results.length > 1) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    const responseData: Draft = {
      id: id,
      content: results[0].content,
      title: results[0].title,
      tags: [],
    }

    return NextResponse.json(responseData)
  } finally {
    connection.release()
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const { id } = params
  const data: Draft = await request.json()

  data.id = id

  if (data.id == null) {
    return NextResponse.json({ error: 'Specify draft ID.' }, { status: 400 })
  }

  if (data.id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  } else if (data.title.length > ARTICLE_TITLE_MAX_LENGTH) {
    return NextResponse.json({ error: 'Title too long' }, { status: 400 })
  } else if (data.content.length > ARTICLE_CONTENT_MAX_LENGTH) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 })
  }

  const draftCount = await countDraft(userEmailHash)
  if (draftCount >= MAX_ARTICLE_COUNT_PER_USER) {
    return NextResponse.json(
      {
        error: `You have already too many drafts ( > ${MAX_ARTICLE_COUNT_PER_USER} )`,
      },
      { status: 400 },
    )
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    await new Promise((resolve, reject) => {
      connection.query(
        postQuery,
        [userEmailHash, data.id, data.title, data.content],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    const responseData: Draft = {
      id: data.id,
      title: data.title,
      content: data.content,
      tags: [],
    }

    return NextResponse.json(
      { status: 'ok', data: responseData },
      { status: 200 },
    )
  } finally {
    connection.release()
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const { id } = params

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        deleteQuery,
        [userEmailHash, id],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (results.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    const responseData = {
      status: 'ok',
      data: {
        id: id,
      },
    }

    return NextResponse.json(responseData, { status: 200 })
  } finally {
    connection.release()
  }
}
