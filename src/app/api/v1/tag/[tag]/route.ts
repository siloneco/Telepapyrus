import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'
export const revalidate = 60

const getQuery = `
SELECT tag FROM allowed_tags WHERE tag = ?;
`

const postQuery = `
INSERT INTO allowed_tags (tag) VALUES (?);
`

const deleteQuery = `
DELETE FROM allowed_tags WHERE tag = ?;
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
    tag: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const { tag } = params

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
        [tag],
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

    return NextResponse.json({ tag: results[0].tag }, { status: 200 })
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

  const { tag } = params

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
        [tag],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    return NextResponse.json(
      { status: 'ok', data: { tag: tag } },
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

  const { tag } = params

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
        [tag],
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
        id: tag,
      },
    }

    return NextResponse.json(responseData, { status: 200 })
  } finally {
    connection.release()
  }
}
