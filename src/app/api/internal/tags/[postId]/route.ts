import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'

const query = 'SELECT `tag` FROM `tags` WHERE `id` = ?;'

type Props = {
    params: {
        postId: string
    }
}

export async function GET(request: Request, { params }: Props) {
    const { postId } = params

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
            connection.query(query, [postId], (error: QueryError | null, results: any) => {
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