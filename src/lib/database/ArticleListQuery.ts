import NodeCache from 'node-cache'
import crypto from 'crypto'
import { Pool, PoolConnection, QueryError } from 'mysql2'
import { getConnectionPool } from './MysqlConnectionPool'

const cache = new NodeCache()
const cacheTTL = 10 // seconds

const mainQuery = `
SELECT
  articles.id,
  articles.title,
  articles.content,
  DATE_FORMAT(articles.date, '%Y/%m/%d') AS date,
  DATE_FORMAT(articles.last_updated, '%Y/%m/%d') AS last_updated,
  tags.tags
FROM
  (
    SELECT
      *
	FROM articles
    WHERE user = ?
    ORDER BY date DESC
    LIMIT 10 OFFSET ?
  )  as articles LEFT JOIN
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tags
  	  FROM tags
      WHERE user = ?
      GROUP BY id
	)
  AS tags ON tags.id = articles.id;
`

const tagQuery = `
SELECT
  articles.id,
  articles.title,
  articles.content,
  DATE_FORMAT(articles.date, '%Y/%m/%d') AS date,
  DATE_FORMAT(articles.last_updated, '%Y/%m/%d') AS last_updated,
  tags.tags
FROM
  articles INNER JOIN 
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') as tags
      FROM tags
      WHERE
        user = ? AND
        id IN (
          SELECT
	        id
          FROM tags
          WHERE
            user = ? AND
            tag IN (?)
          GROUP BY id
          HAVING COUNT(DISTINCT tag) = ?
        )
      GROUP BY id
    ) as tags ON tags.id = articles.id
ORDER BY date DESC LIMIT ? OFFSET ?;
`

function calcHash(tags: string[], page: number = 1) {
  const cacheKeyData = { tags: tags, page: page }
  return crypto
    .createHash('md5')
    .update(JSON.stringify(cacheKeyData))
    .digest('hex')
}

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

export async function queryAllArticles(
  user: string,
  page: number = 1,
): Promise<any[] | null> {
  const cacheKey = user + calcHash([], page)

  const data: any[] | undefined = cache.get(cacheKey)
  if (data !== undefined) {
    return data
  }

  const connection = await getConnection()
  if (connection === null) {
    cache.set(user + calcHash([], page), null, 1)
    return null
  }

  try {
    const offset = 10 * (page - 1)

    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        mainQuery,
        [user, offset, user],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    for (let i = 0; i < results.length; i++) {
      const tagStr: string = results[i].tags
      if (tagStr == null) {
        results[i].tags = []
        continue
      }

      results[i].tags = tagStr.split(',')
    }

    cache.set(cacheKey, results, cacheTTL)

    return results
  } finally {
    connection.release()
  }
}

export async function queryWithTags(
  user: string,
  tags: string[],
  page: number = 1,
) {
  const cacheKey = user + calcHash(tags, page)

  const data = cache.get(cacheKey)
  if (data !== undefined) {
    return data
  }

  const connection = await getConnection()

  if (connection === null) {
    cache.set(user + calcHash(tags, page), null, 1)
    return null
  }

  try {
    const distinctTags = tags.filter((tag, index, self) => {
      return self.indexOf(tag) === index
    })

    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        tagQuery,
        [user, user, distinctTags, distinctTags.length, 10, 10 * (page - 1)],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    for (let i = 0; i < results.length; i++) {
      const tagStr: string = results[i].tags
      results[i].tags = tagStr.split(',')
    }

    cache.set(cacheKey, results, cacheTTL)

    return results
  } finally {
    connection.release()
  }
}
