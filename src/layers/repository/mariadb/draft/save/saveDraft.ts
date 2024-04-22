import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { insertDraftSQL } from './query'
import { Draft } from '@/layers/entity/types'

export type SaveDraftReturnProps = {
  success: boolean
  error?: {
    id: 'invalid-data' | 'unknown'
    message: string
  }
}

const createError = (error: any): SaveDraftReturnProps => {
  const data: SaveDraftReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: error.message,
    },
  }

  if (
    error.code === 'ER_DATA_TOO_LONG' ||
    error.code === 'ER_NO_REFERENCED_ROW_2'
  ) {
    data.error!.id = 'invalid-data'
  }

  return data
}

export const saveDraft = async (
  draft: Draft,
): Promise<SaveDraftReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      await connection.query(insertDraftSQL, {
        id: draft.id,
        title: draft.title,
        content: draft.content,
      })

      await connection.commit()

      const returnValue: SaveDraftReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      return createError(error)
    }
  })
}
