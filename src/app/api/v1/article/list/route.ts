const crypto = require('crypto')
const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 10 // seconds

import { NextRequest, NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'

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

function calcHash(tags: string[], page: number = 1) {
  const cacheKeyData = { tags: tags, page: page }
  return crypto
    .createHash('md5')
    .update(JSON.stringify(cacheKeyData))
    .digest('hex')
}

async function queryAllArticles(connection: PoolConnection, page: number = 1) {
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

  cache.set(calcHash([], page), results, cacheTTL)

  return NextResponse.json(results)
}

async function queryWithTags(
  connection: PoolConnection,
  tags: string[],
  page: number = 1,
) {
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

  cache.set(calcHash(tags, page), results, cacheTTL)

  return NextResponse.json(results)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags: string[] = searchParams.get('tags')?.split(',') ?? []

  for (const tag of tags) {
    if (tag.length > TAG_NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Tag name is too long (max ${TAG_NAME_MAX_LENGTH} chars)` },
        { status: 400 },
      )
    }
  }

  let page: number = Number(searchParams.get('page')) ?? -1

  if (page < 1) {
    page = 1
  }

  const cachedValue = cache.get(calcHash(tags, page))
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
      return await queryWithTags(connection, tags, page)
    } else {
      return await queryAllArticles(connection, page)
    }
  } finally {
    connection.release()
  }
}
