const NodeCache = require('node-cache')
const cache = new NodeCache()

const cacheTTL = 10 // seconds

import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { Article, Draft } from '@/components/types/Article'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'

export const dynamic = 'force-dynamic'

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
        WHERE id = ?
        GROUP BY id
      ),
      NULL
    ) AS tag
  ) AS tag
WHERE articles.id = ?;
`

const postQueryForArticle = `
INSERT INTO articles (id, title, content, date) VALUES (?, ?, ?, now())
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  content = VALUES(content),
  last_updated = now()
;
`

const postQueryDeletingAllTags = `
DELETE FROM tags WHERE id = ?;
`

const postQueryAddTags = `
INSERT INTO tags (id, tag) VALUES ?;
`

const deleteQuery = `
DELETE FROM articles WHERE id = ?;
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

async function updateArticleTags(
  connection: PoolConnection,
  id: string,
  tags: string[],
) {
  const tagInsertValues: string[][] = []
  tags.forEach((tag) => {
    tagInsertValues.push([id, tag])
  })

  await new Promise((resolve, reject) => {
    connection.beginTransaction((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })

    connection.query(
      postQueryDeletingAllTags,
      [id],
      (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      },
    )

    connection.query(
      postQueryAddTags,
      [tagInsertValues],
      (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      },
    )

    connection.commit((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })
  })
}

async function getArticle(
  connection: PoolConnection,
  id: string,
): Promise<Article | null> {
  const results: Array<any> = await new Promise((resolve, reject) => {
    connection.query(
      getQuery,
      [id, id],
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

  cache.set(id, article, cacheTTL)

  return article
}

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  const { id } = params

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  }

  const cachedValue = cache.get(id)
  if (cachedValue !== undefined) {
    return NextResponse.json(cachedValue)
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const article = await getArticle(connection, id)

    if (article === null) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } finally {
    connection.release()
  }
}

export async function POST(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: Draft = await request.json()
  data.id = params.id

  if (data.id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    await new Promise((resolve, reject) => {
      connection.query(
        postQueryForArticle,
        [data.id, data.title, data.content],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (data.tags !== undefined && data.tags.length > 0) {
      await updateArticleTags(connection, data.id, data.tags)
    }

    const article = await getArticle(connection, data.id)

    if (article === null) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ status: 'ok', data: article })
  } finally {
    connection.release()
  }
}

export async function DELETE(request: Request, { params }: Props) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    return NextResponse.json({ error: 'ID too long' }, { status: 400 })
  }

  const connection: PoolConnection = await getConnection()

  if (connection == null) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  try {
    const result: any[] = await new Promise((resolve, reject) => {
      connection.query(
        deleteQuery,
        [id],
        (error: QueryError | null, results: any) => {
          if (error) {
            reject(error)
          }
          resolve(results)
        },
      )
    })

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    const responseData = {
      status: 'ok',
      data: {
        id: id,
      },
    }

    return NextResponse.json({ status: 'ok', data: responseData })
  } finally {
    connection.release()
  }
}
