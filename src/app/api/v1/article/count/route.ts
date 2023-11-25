import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

export const dynamic = 'force-dynamic'

const mainQuery = `
SELECT
  COUNT(*) AS count
FROM articles;
`

const tagQuery = `
SELECT
  COUNT(*) AS count
FROM (
  SELECT
	  id
	FROM tags
    WHERE tag IN (?)
    GROUP BY id
    HAVING COUNT(DISTINCT tag) = ?
  ) AS a;
`

type ReturnProps = {
  count: number
}

async function queryAllArticles(connection: PoolConnection) {
  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(mainQuery, (error: QueryError | null, results: any) => {
      if (error) {
        reject(error)
      }
      resolve(results)
    })
  })

  if (results.length !== 1) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const returnData: ReturnProps = {
    count: results[0]['count'],
  }

  return NextResponse.json(returnData)
}

async function queryWithTags(connection: PoolConnection, tags: string[]) {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      tagQuery,
      [distinctTags, distinctTags.length],
      (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      },
    )
  })

  if (results.length !== 1) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const returnData: ReturnProps = {
    count: results[0]['count'],
  }

  return NextResponse.json(returnData)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []

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
    if (tags.length > 0) {
      return await queryWithTags(connection, tags)
    } else {
      return await queryAllArticles(connection)
    }
  } finally {
    connection.release()
  }
}
