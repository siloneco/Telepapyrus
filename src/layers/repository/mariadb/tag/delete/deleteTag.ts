import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { getDeleteTagSQL } from './query'

type ErrorIDs = 'not-exists' | 'too-many-rows-affected' | 'unknown'
export type DeleteTagReturnProps = {
  success: boolean
  error?: {
    id: ErrorIDs
    message: string
  }
}

const createError = (id: ErrorIDs, msg?: string): DeleteTagReturnProps => {
  const data: DeleteTagReturnProps = {
    success: false,
    error: {
      id: id,
      message: 'Unknown Error',
    },
  }

  if (msg) {
    data.error!.message = msg
  }

  if (id === 'not-exists') {
    data.error!.message = 'Tag does not exists'
  } else if (id === 'too-many-rows-affected') {
    data.error!.message = 'Too many rows affected'
  }

  return data
}

export const deleteTag = async (tag: string): Promise<DeleteTagReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      const result: any[] = await connection.query(getDeleteTagSQL(), { tag })

      const affectedRows: number = result[0].affectedRows

      if (affectedRows !== 1) {
        await connection.rollback()

        if (affectedRows <= 0) return createError('not-exists')
        if (affectedRows > 1) return createError('too-many-rows-affected')
      }

      await connection.commit()

      const returnValue: DeleteTagReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      return createError('unknown', error.message)
    }
  })
}
