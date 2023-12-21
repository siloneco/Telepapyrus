import { getConnectionData } from '@/layers/constant/databaseConstants'
import { createPool, Pool, PoolOptions } from 'mysql2/promise'

let connectionPool: Pool

async function getConnectionPool() {
  if (connectionPool) {
    return connectionPool
  }

  const connectionData = getConnectionData()

  const connectionOptions: PoolOptions = {
    host: connectionData.hostname,
    port: connectionData.port,
    user: connectionData.username,
    password: connectionData.password,
    database: connectionData.database,
    connectionLimit: connectionData.connectionLimit,
  }

  connectionPool = createPool(connectionOptions)

  return connectionPool
}

export default getConnectionPool
