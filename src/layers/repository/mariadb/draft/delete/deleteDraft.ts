import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { getDeleteDraftSQL } from './query'

type ErrorIDs = 'not-exists' | 'too-many-rows-affected' | 'unknown'
export type DeleteDraftReturnProps = {
  success: boolean
  error?: {
    id: ErrorIDs
    message: string
  }
}

const createError = (
  id: ErrorIDs = 'unknown',
  msg?: string,
): DeleteDraftReturnProps => {
  const data: DeleteDraftReturnProps = {
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
  }

  if (msg !== undefined) {
    data.error!.message = msg
  }

  return data
}

export const deleteDraft = async (
  id: string,
): Promise<DeleteDraftReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      const deleteResult: any[] = await connection.query(getDeleteDraftSQL(), [
        id,
      ])

      const affectedRows: number = deleteResult[0].affectedRows

      if (affectedRows !== 1) {
        await connection.rollback()

        if (affectedRows <= 0) return createError('not-exists')
        if (affectedRows > 1) return createError('too-many-rows-affected')
      }

      await connection.commit()

      const returnValue: DeleteDraftReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      return createError('unknown', error.message)
    }
  })
}
