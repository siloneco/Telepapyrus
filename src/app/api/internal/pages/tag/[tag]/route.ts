import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

const query = 'SELECT COUNT(`id`) AS count FROM `tags` WHERE `tag` = ?;'

export async function GET(
    request: Request,
    { params }: { params: { tag: string } }
) {
    const tag: string = params.tag
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
            connection.query(query, tag, (error: QueryError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        if (results.length == 0) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        return NextResponse.json({ max: Math.floor(results[0].count / 10) + 1 })
    } finally {
        connection.release()
    }
}