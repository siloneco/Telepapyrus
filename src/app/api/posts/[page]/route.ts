import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, MysqlError } from 'mysql'

const pageBoundaryQuery = 'SELECT `date` FROM `pages` WHERE `page` = ?;'
const mainQuery = 'SELECT `id`, `title`, DATE_FORMAT(date, \'%Y/%m/%d\') AS formatted_date, DATE_FORMAT(last_updated, \'%Y/%m/%d\') AS last_updated FROM `articles` WHERE `date` <= ? ORDER BY `date` DESC LIMIT 10;'
const tagsQuery = 'SELECT `id`, `tag` FROM `tags` WHERE `id` IN (?);'

export async function GET(request: Request, { params }: { params: { page: string } }) {
    const page: number = parseInt(params.page)
    if (isNaN(page)) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
    }

    const connection: PoolConnection = await new Promise((resolve, reject) => {
        getConnectionPool().then((connectionPool: Pool) => {
            connectionPool.getConnection((error: MysqlError, connection: PoolConnection) => {
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
        const pagenationResults: Array<any> = await new Promise((resolve, reject) => {
            connection.query(pageBoundaryQuery, page, (error: MysqlError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        if (pagenationResults.length === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 })
        }

        const bounadryDate = pagenationResults[0].date

        const results: Array<any> = await new Promise((resolve, reject) => {
            connection.query(mainQuery, bounadryDate, (error: MysqlError | null, results: any) => {
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
            connection.query(tagsQuery, [ids], (error: MysqlError | null, results: any) => {
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