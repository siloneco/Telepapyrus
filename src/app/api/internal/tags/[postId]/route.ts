import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, MysqlError } from 'mysql'

const query = 'SELECT `tag` FROM `tags` WHERE `id` = ?;'

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const postId = params.postId

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
        const results: Array<any> = await new Promise((resolve, reject) => {
            connection.query(query, [postId], (error: MysqlError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        const tags: Array<string> = results.map((result: any) => { return result.tag })

        return NextResponse.json({
            id: postId,
            tags: tags
        })

    } finally {
        connection.release()
    }
}