import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

const mainQuery: string = `
SELECT
    tags.id,
    articles.title,
    DATE_FORMAT(articles.date, '%Y/%m/%d') AS formatted_date,
    DATE_FORMAT(articles.last_updated, '%Y/%m/%d') AS last_updated
from tags INNER JOIN articles ON tags.id = articles.id
WHERE tag = ? ORDER BY date DESC LIMIT 2 OFFSET ?;
`
const tagsQuery = 'SELECT `id`, `tag` FROM `tags` WHERE `id` IN (?);'

type Props = {
    params: {
        tag: string,
        page: string[]
    }
}

export async function GET(request: Request, { params }: Props) {
    const tag: string = params.tag
    let page: number = 1
    if (params.page !== undefined) {
        page = parseInt(params.page[0])
        if (isNaN(page)) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }
    }

    const connection: PoolConnection = await new Promise((resolve, reject) => {
        getConnectionPool().then((connectionPool: Pool) => {
            connectionPool.getConnection((error: NodeJS.ErrnoException | null, connection: PoolConnection) => {
                if (error) {
                    reject(error)
                }
                resolve(connection)
            })
        })
    })

    if (connection == null) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    try {
        const results: Array<any> = await new Promise((resolve, reject) => {
            connection.query(mainQuery, [tag, (page - 1) * 10], (error: QueryError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        if (results.length === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 })
        }

        const tagsResult: Array<any> = await new Promise((resolve, reject) => {
            const ids: Array<number> = results.map((result: any) => result.id)
            connection.query(tagsQuery, [ids], (error: QueryError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        const tags: Map<string, Array<string>> = new Map()
        tagsResult.forEach((result: any) => {
            const id: string = result.id
            const tag: string = result.tag
            if (tags.has(id)) {
                tags.get(id)?.push(tag)
            } else {
                tags.set(id, [tag])
            }
        })

        for (let i = 0; i < results.length; i++) {
            const id: string = results[i].id
            results[i].tags = tags.has(id) ? tags.get(id) : []
        }

        return NextResponse.json(results)
    } finally {
        connection.release()
    }
}