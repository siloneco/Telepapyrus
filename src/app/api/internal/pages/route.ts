import { NextResponse } from 'next/server'
import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'
import { PoolConnection, Pool, MysqlError } from 'mysql'

const query = 'SELECT MAX(`page`) as max FROM `pages`;'

export async function GET(request: Request) {
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
            connection.query(query, (error: MysqlError | null, results: any) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        })

        if (results.length == 0) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        return NextResponse.json(results[0])
    } finally {
        connection.release()
    }
}