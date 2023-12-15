import { PoolConnection, Pool, QueryError } from 'mysql2'
import { ArticleOverview } from '@/components/types/Article'
import { getConnectionPool } from './MysqlConnectionPool'

export const dynamic = 'force-dynamic'

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
    ORDER BY date DESC
  ) as articles LEFT JOIN
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tags
  	  FROM tags
      GROUP BY id
	)
  AS tags ON tags.id = articles.id;
`

export async function getAllArticles(): Promise<ArticleOverview[]> {
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
    return []
  }

  const results: any[] = await new Promise((resolve, reject) => {
    connection.query(mainQuery, (error: QueryError | null, results: any) => {
      if (error) {
        reject(error)
      }
      resolve(results)
    })
  })

  for (let i = 0; i < results.length; i++) {
    const tagStr: string = results[i].tags
    if (tagStr == null) {
      results[i].tags = []
      continue
    }

    results[i].tags = tagStr.split(',')
  }

  return results as ArticleOverview[]
}
