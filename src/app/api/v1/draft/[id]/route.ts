import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { Draft } from '@/components/types/Article'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { isValidID } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const getQuery = `
SELECT id, title, content FROM drafts WHERE id = ?;
`

const postQuery = `
INSERT INTO drafts (id, title, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content);
`

const deleteQuery = `
DELETE FROM drafts WHERE id = ?;
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
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  } else if (!isValidID(id)) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
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
        [id],
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
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const data: Draft = await request.json()

  data.id = id

  if (data.id == null) {
    return NextResponse.json({ error: 'Specify draft ID.' }, { status: 400 })
  }

  if (data.id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  } else if (!isValidID(data.id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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
        [data.id, data.title, data.content],
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
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  } else if (!isValidID(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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
        [id],
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
