import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'

const query =
  "SELECT `id`, `title`, `content`, DATE_FORMAT(date, '%Y/%m/%d') AS date, DATE_FORMAT(last_updated, '%Y/%m/%d') AS last_updated FROM `articles` WHERE `id` = ?;"

type Props = {
  params: {
    postId: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const { postId } = params

  const fetchTags = fetch(
    `${INTERNAL_BACKEND_HOSTNAME}/api/internal/tags/${postId}`,
    { next: { revalidate: 60 } },
  )

  const connection: PoolConnection = await new Promise((resolve, reject) => {
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

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        query,
        [postId],
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

    const tags: Array<string> = await new Promise((resolve, reject) => {
      fetchTags.then((response: Response) => {
        if (response.ok) {
          response.json().then((json: any) => {
            resolve(json.tags)
          })
        } else {
          reject(response)
        }
      })
    })

    return NextResponse.json({
      id: postId,
      content: results[0].content,
      title: results[0].title,
      formatted_date: results[0].date,
      last_updated: results[0].last_updated,
      tags: tags,
    })
  } finally {
    connection.release()
  }
}
