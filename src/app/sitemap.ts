import { MetadataRoute } from 'next'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

const baseUrl = process.env.BASEURL || ''
const query = `
SELECT id, IFNULL(last_updated, date) as date FROM articles;
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    const results: Array<any> = await new Promise((resolve, reject) => {
      connection.query(query, (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      })
    })

    const currentTime: number = new Date().getTime()
    for (const result of results) {
      const date: Date = new Date(result.date)
      let changeFreq:
        | 'daily'
        | 'always'
        | 'hourly'
        | 'weekly'
        | 'monthly'
        | 'yearly'
        | 'never' = 'daily'

      if (currentTime - date.getTime() > 86400000 * 30) {
        // a month passed since last update
        changeFreq = 'monthly'
      } else if (currentTime - date.getTime() > 86400000 * 7) {
        // a week passed since last update
        changeFreq = 'weekly'
      } else {
        changeFreq = 'daily'
      }

      sitemapData.push({
        url: `${baseUrl}/article/${result.id}`,
        lastModified: new Date(result.date),
        changeFrequency: changeFreq,
        priority: 0.5,
      })
    }

    return sitemapData
  } finally {
    connection.release()
  }
}
