import { Pool, PoolConnection } from 'mysql2/promise'
import getConnectionPool from './getConnectionPool'

const getConnection = async (): Promise<PoolConnection> => {
  const connectionPool: Pool = await getConnectionPool()
  return await connectionPool.getConnection()
}

const withConnection = async <T>(
  callback: (_connection: PoolConnection) => Promise<T>,
): Promise<T> => {
  const connection = await getConnection()

  if (connection === null) {
    throw new Error('connection is null')
  }

  try {
    return await callback(connection)
  } finally {
    connection.release()
  }
}

export default withConnection
