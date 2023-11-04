import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { Pool, PoolConnection, QueryError } from 'mysql2'
import { PostSubmitFormat } from '@/components/types/PostSubmitFormat'

const mainSql = 'INSERT INTO articles (id, title, content, date) VALUES (?, ?, ?, current_time())'
const tagSql = 'INSERT INTO tags (id, tag) VALUES (?, ?)'

async function insertTagRecord(connection: PoolConnection, id: string, tag: string) {
    return new Promise((resolve, reject) => {
        connection.execute(tagSql, [id, tag],
            (error: QueryError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
    })
}

// This endpoint requires authentication. The blocking is done in middleware.ts

export async function POST(request: Request) {
    const data: PostSubmitFormat = await request.json()

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
        const res: any = await new Promise((resolve, reject) => {
            connection.execute(mainSql, [data.id, data.title, data.content],
                (error: QueryError | null, results: any) => {
                    if (error) {
                        if (error.errno == 1062) {
                            resolve({ errno: 1062, errorMsg: 'Post already exists' })
                        }
                        reject(error)
                    }
                    resolve(results)
                })
        })

        if ('errno' in res && res.errno == 1062) {
            return NextResponse.json({ error: res.errorMsg }, { status: 409 })
        }

        const tagPromise = []
        for (const tag of data.tags) {
            tagPromise.push(insertTagRecord(connection, data.id, tag))
        }

        await Promise.all(tagPromise)
    } finally {
        connection.release()
    }

    return NextResponse.json({ status: 'OK' }, { status: 200 })
}