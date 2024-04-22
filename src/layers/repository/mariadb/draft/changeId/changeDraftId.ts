import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { getQuery } from './query'

type ErrorIDs =
  | 'not-exists'
  | 'too-many-rows-affected'
  | 'already-exists'
  | 'invalid-data'
  | 'unknown'

export type ChangeDraftIdReturnProps = {
  success: boolean
  error?: {
    id: ErrorIDs
    message: string
  }
}

const createError = (
  id: ErrorIDs = 'unknown',
  msg?: string,
): ChangeDraftIdReturnProps => {
  const data: ChangeDraftIdReturnProps = {
    success: false,
    error: {
      id: id,
      message: 'Unknown error',
    },
  }

  if (id === 'not-exists') {
    data.error!.message = 'Draft does not exists'
  } else if (id === 'too-many-rows-affected') {
    data.error!.message = 'Too many rows affected'
  } else if (id === 'already-exists') {
    data.error!.message = 'Draft already exists'
  }

  if (msg !== undefined) {
    data.error!.message = msg
  }

  return data
}

export const changeDraftId = async (
  oldId: string,
  newId: string,
): Promise<ChangeDraftIdReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      const updateResult: any[] = await connection.query(getQuery(), {
        newId,
        oldId,
      })

      const affectedRows: number = updateResult[0].affectedRows

      if (affectedRows !== 1) {
        await connection.rollback()

        if (affectedRows <= 0) return createError('not-exists')
        if (affectedRows > 1) return createError('too-many-rows-affected')
      }

      await connection.commit()

      const returnValue: ChangeDraftIdReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      if (error.code === 'ER_DUP_ENTRY') {
        return createError('already-exists')
      } else if (error.code === 'ER_DATA_TOO_LONG') {
        return createError('invalid-data')
      }

      console.log(error)

      return createError('unknown', error.message)
    }
  })
}
