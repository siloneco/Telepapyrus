import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

export const dynamic = 'force-dynamic'
export const revalidate = 60

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
    WHERE date <= (
        SELECT date FROM pages WHERE page = ?
      )
    ORDER BY date DESC
    LIMIT 10
  )  as articles LEFT JOIN
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tags
  	  FROM tags
      WHERE id IN
        (
          SELECT
            id
          FROM articles
          WHERE date <=
            (
              SELECT date FROM pages WHERE page = ?
            )
        )
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
      WHERE id IN
      (
        SELECT
	      id
        FROM tags
        WHERE tag IN (?)
        GROUP BY id
        HAVING COUNT(DISTINCT tag) = ?
      )
      GROUP BY id
    ) as tags ON tags.id = articles.id
ORDER BY date DESC LIMIT ? OFFSET ?;
`

async function queryAllArticles(connection: PoolConnection, page: number = 1) {
  if (page < 1) {
    page = 1
  }

  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      mainQuery,
      [page, page],
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

  return NextResponse.json(results)
}

async function queryWithTags(
  connection: PoolConnection,
  tags: string[],
  page: number = 1,
) {
  if (page < 1) {
    page = 1
  }

  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      tagQuery,
      [distinctTags, distinctTags.length, 10, 10 * (page - 1)],
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

  return NextResponse.json(results)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []
  const page: number = Number(searchParams.get('page')) ?? -1

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
      return await queryWithTags(connection, tags, page)
    } else {
      return await queryAllArticles(connection, page)
    }
  } finally {
    connection.release()
  }
}
