import { createPool, Pool } from 'mysql2'

let connectionPool: Pool

async function getConnectionPool() {
    if (connectionPool) {
        return connectionPool
    }

    const hostname: string = process.env.DATABASE_HOST || 'localhost'
    const port: number = Number(process.env.DATABASE_PORT) || 3306
    const user: string = process.env.DATABASE_USER || 'root'
    const password: string = process.env.DATABASE_PASSWORD || 'password'
    const database: string = process.env.DATABASE_SCHEMA || 'telepapyrus'

    connectionPool = createPool({
        connectionLimit: 10,
        host: hostname,
        port: port,
        user: user,
        password: password,
        database: database
    })

    return connectionPool
}

export { getConnectionPool }