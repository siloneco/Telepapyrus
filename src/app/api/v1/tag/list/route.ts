const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 1 // second

import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

export const dynamic = 'force-dynamic'

const query = `
SELECT tag FROM allowed_tags;
`

export async function GET(_req: Request) {
  const cachedValue = cache.get('key')
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
      connection.query(query, (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      })
    })

    const tags: string[] = results.map((result: any) => result.tag)
    const returnValue = { tags: tags }

    cache.set('key', returnValue, cacheTTL)

    return NextResponse.json(returnValue)
  } finally {
    connection.release()
  }
}
