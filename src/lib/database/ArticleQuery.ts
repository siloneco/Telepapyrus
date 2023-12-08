import NodeCache from 'node-cache'
import { Pool, PoolConnection, QueryError } from 'mysql2'
import { getConnectionPool } from './MysqlConnectionPool'
import { Article } from '@/components/types/Article'

const cache = new NodeCache()
const cacheTTL = 10 // seconds

const getQuery = `
SELECT
  articles.id,
  articles.title,
  articles.content,
  DATE_FORMAT(articles.date, '%Y/%m/%d') AS date,
  DATE_FORMAT(articles.last_updated, '%Y/%m/%d') AS last_updated,
  tag.tag
FROM
  articles,
  (
    SELECT IFNULL(
      (
        SELECT
          GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tag
  	    FROM tags
        WHERE
          user = ? AND
          id = ?
        GROUP BY id
      ),
      NULL
    ) AS tag
  ) AS tag
WHERE
  articles.user = ? AND
  articles.id = ?
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

export async function getArticle(
  user: string,
  id: string,
): Promise<Article | null> {
  const connection = await getConnection()

  if (connection === null) {
    return null
  }

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(
        getQuery,
        [user, id, user, id],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (results.length === 0) {
      return null
    }

    const tagRes: string = results[0].tag
    let tag: string[] = []
    if (tagRes !== null) {
      tag = tagRes.split(',')
    }

    const article: Article = {
      id: id,
      content: results[0].content,
      title: results[0].title,
      date: results[0].date,
      last_updated: results[0].last_updated,
      tags: tag,
    }

    cache.set(user + id, article, cacheTTL)

    return article
  } finally {
    connection.release()
  }
}
