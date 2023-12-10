import NodeCache from 'node-cache'
import { Pool, PoolConnection, QueryError } from 'mysql2'
import { getConnectionPool } from './MysqlConnectionPool'

const cache = new NodeCache()
const cacheTTL = 10 // seconds

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

type ReturnProps = {
  count: number
}

async function queryAllArticles(user: string): Promise<ReturnProps | null> {
  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return null
  }

  try {
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
      return null
    }

    const returnData: ReturnProps = {
      count: results[0]['count'],
    }

    cache.set(user, returnData, cacheTTL)

    return returnData
  } finally {
    connection.release()
  }
}

async function queryWithTags(
  user: string,
  tags: string[],
): Promise<ReturnProps | null> {
  const connection: PoolConnection = await getConnection()
  if (connection == null) {
    return null
  }

  try {
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
      return null
    }

    const returnData: ReturnProps = {
      count: results[0]['count'],
    }

    cache.set(user + tags.join(','), returnData, cacheTTL)

    return returnData
  } finally {
    connection.release()
  }
}

export async function countArticle(
  user: string,
  tags: string[],
): Promise<ReturnProps | null> {
  const cachedValue: ReturnProps | undefined = cache.get(user + tags.join(','))
  if (cachedValue !== undefined) {
    return cachedValue
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return null
  }

  try {
    if (tags.length > 0) {
      return await queryWithTags(user, tags)
    } else {
      return await queryAllArticles(user)
    }
  } finally {
    connection.release()
  }
}

export async function increaseAmountWhenCacheIsValid(user: string) {
  const cacheData: ReturnProps | undefined = cache.get(user)
  if (cacheData !== undefined) {
    const newData: ReturnProps = {
      count: cacheData.count + 1,
    }

    cache.set(user, newData, cacheTTL)
  }
}
