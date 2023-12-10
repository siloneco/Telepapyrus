import { PoolConnection } from 'node_modules/mysql2/typings/mysql/lib/PoolConnection'
import { getConnectionPool } from './MysqlConnectionPool'
import { Pool, QueryError } from 'mysql2'

const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 10 // seconds

const draftQuery = `
SELECT
  COUNT(*) AS count
FROM drafts
WHERE user = ?;
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

export async function countDraft(user: string): Promise<number> {
  const cachedData = cache.get(`draft-${user}`)
  if (cachedData !== undefined) {
    return cachedData
  }

  const connection = await getConnection()

  if (connection == null) {
    return -1
  }

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        draftQuery,
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
      return -1
    }

    const res = results[0]['count']
    cache.set(`draft-${user}`, res, cacheTTL)

    return res
  } finally {
    connection.release()
  }
}
