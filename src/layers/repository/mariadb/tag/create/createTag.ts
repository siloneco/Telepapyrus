import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { insertTagSQL } from './query'

export type CreateTagReturnProps = {
  success: boolean
  error?: {
    id: 'already-exists' | 'invalid-data' | 'unknown'
    message: string
  }
}

const createError = (error: any): CreateTagReturnProps => {
  const data: CreateTagReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: error.message,
    },
  }

  if (error.code === 'ER_DUP_ENTRY') {
    data.error!.id = 'already-exists'
  } else if (error.code === 'ER_DATA_TOO_LONG') {
    data.error!.id = 'invalid-data'
  }

  return data
}

export const createTag = async (tag: string): Promise<CreateTagReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      await connection.query(insertTagSQL, [tag])

      await connection.commit()

      const returnValue: CreateTagReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      return createError(error)
    }
  })
}
