import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { Draft } from '@/components/types/Article'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'
import { getArticle } from '@/lib/database/ArticleQuery'

export const dynamic = 'force-dynamic'

const postQueryForArticle = `
INSERT INTO articles (user, id, title, content, date) VALUES (?, ?, ?, ?, now())
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  content = VALUES(content),
  last_updated = now()
`

const postQueryDeletingAllTags = `
DELETE FROM tags WHERE user = ? AND id = ?;
`

const postQueryAddTags = `
INSERT INTO tags (user, id, tag) VALUES ?;
`

const deleteQuery = `
DELETE FROM articles WHERE user = ? AND id = ?;
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

async function updateArticleTags(
  connection: PoolConnection,
  user: string,
  id: string,
  tags: string[],
) {
  const tagInsertValues: string[][] = []
  tags.forEach((tag) => {
    tagInsertValues.push([user, id, tag])
  })

  await new Promise((resolve, reject) => {
    connection.beginTransaction((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })

    connection.query(
      postQueryDeletingAllTags,
      [user, id],
      (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      },
    )

    connection.query(
      postQueryAddTags,
      [tagInsertValues],
      (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      },
    )

    connection.commit((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })
  })
}

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const { id } = params

  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const article = await getArticle(userEmailHash, id)

  if (article === null) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function POST(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const data: Draft = await request.json()
  data.id = params.id

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
        postQueryForArticle,
        [userEmailHash, data.id, data.title, data.content],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (data.tags !== undefined && data.tags.length > 0) {
      await updateArticleTags(connection, userEmailHash, data.id, data.tags)
    }

    const article = await getArticle(userEmailHash, data.id)

    if (article === null) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ status: 'ok', data: article })
  } finally {
    connection.release()
  }
}

export async function DELETE(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const userEmailHash = sha256(session.user.email)

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const result: any[] = await new Promise((resolve, reject) => {
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

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    const responseData = {
      status: 'ok',
      data: {
        id: id,
      },
    }

    return NextResponse.json({ status: 'ok', data: responseData })
  } finally {
    connection.release()
  }
}
