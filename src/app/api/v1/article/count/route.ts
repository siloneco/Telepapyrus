const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 10 // seconds

import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { sha256 } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const mainQuery = `
SELECT
  COUNT(*) AS count
FROM articles
WHERE user = ?;
`

const tagQuery = `
SELECT
  COUNT(*) AS count
FROM (
  SELECT
	  id
	FROM tags
    WHERE
      user = ? AND
      tag IN (?)
    GROUP BY id
    HAVING COUNT(DISTINCT tag) = ?
  ) AS a;
`

type ReturnProps = {
  count: number
}

async function queryAllArticles(connection: PoolConnection, user: string) {
  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      mainQuery,
      [user],
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

  cache.set(user, returnData, cacheTTL)

  return NextResponse.json(returnData)
}

async function queryWithTags(
  connection: PoolConnection,
  user: string,
  tags: string[],
) {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      tagQuery,
      [user, distinctTags, distinctTags.length],
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

  cache.set(user + tags.join(','), returnData, cacheTTL)

  return NextResponse.json(returnData)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []

  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const cachedValue = cache.get(userEmailHash + tags.join(','))
  if (cachedValue !== undefined) {
    return NextResponse.json(cachedValue)
  }

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
      return await queryWithTags(connection, userEmailHash, tags)
    } else {
      return await queryAllArticles(connection, userEmailHash)
    }
  } finally {
    connection.release()
  }
}
