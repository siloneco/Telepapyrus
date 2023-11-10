import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, QueryError } from 'mysql2'
import { Draft } from '@/components/types/Post'

const saveSql = 'INSERT INTO `drafts` (`id`, `title`, `content`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `content` = VALUE(`content`), `title` = VALUE(`title`);'

async function saveDraft(id: string, title: string, content: string) {
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
        return false
    }

    try {
        const results: Array<any> = await new Promise((resolve, reject) => {
            connection.execute(saveSql, [id, title, content], (error: QueryError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        if (results.length == 0) {
            return false
        }

        return true
    } finally {
        connection.release()
    }
}

// This endpoint requires authentication. The blocking is done in middleware.ts
export async function POST(request: Request) {
    const data: Draft = await request.json()
    const result = await saveDraft(data.id, data.title, data.content)

    if (!result) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
}