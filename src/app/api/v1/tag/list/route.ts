const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 1 // second

import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const query = `
SELECT tag FROM allowed_tags WHERE user = ?;
`

export async function GET(_req: Request) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userEmailHash = sha256(session.user.email)

  const cachedValue = cache.get(userEmailHash)
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
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        query,
        [userEmailHash],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    const tags: string[] = results.map((result: any) => result.tag)
    const returnValue = { tags: tags }

    cache.set(userEmailHash, returnValue, cacheTTL)

    return NextResponse.json(returnValue)
  } finally {
    connection.release()
  }
}
