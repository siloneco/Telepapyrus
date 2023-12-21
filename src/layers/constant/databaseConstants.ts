const getHostname = (): string | undefined => {
  return process.env.DATABASE_HOST
}

const getPort = (): number | undefined => {
  const raw = process.env.DATABASE_PORT
  if (raw === undefined) {
    return undefined
  }

  return Number(raw)
}

const getUsername = (): string | undefined => {
  return process.env.DATABASE_USER
}

const getPassword = (): string | undefined => {
  return process.env.DATABASE_PASSWORD
}

const getDatabase = (): string | undefined => {
  return process.env.DATABASE_SCHEMA
}

const getConnectionLimit = (): number => {
  const raw = process.env.DATABASE_CONNECTION_LIMIT
  if (raw === undefined) {
    return 10
  }

  return Number(raw)
}

const validateConnectionData = async (
  connectionData: DatabaseConnectionData,
): Promise<void> => {
  if (!connectionData.hostname)
    throw new Error('Database hostname is not defined')
  if (!connectionData.port) throw new Error('Database port is not defined')
  if (!connectionData.username)
    throw new Error('Database username is not defined')
  if (!connectionData.password)
    throw new Error('Database password is not defined')
  if (!connectionData.database)
    throw new Error('Database schema is not defined')
  if (connectionData.connectionLimit <= 0)
    throw new Error('Database connection limit must be greater than 0')
  if (!Number.isInteger(connectionData.connectionLimit))
    throw new Error('Database connection limit must be an integer')
}

export type DatabaseConnectionData = {
  hostname: string | undefined
  port: number | undefined
  username: string | undefined
  password: string | undefined
  database: string | undefined
  connectionLimit: number
}

export const getConnectionData = (): DatabaseConnectionData => {
  const data: DatabaseConnectionData = {
    hostname: getHostname(),
    port: getPort(),
    username: getUsername(),
    password: getPassword(),
    database: getDatabase(),
    connectionLimit: getConnectionLimit(),
  }

  validateConnectionData(data)

  return data
}
