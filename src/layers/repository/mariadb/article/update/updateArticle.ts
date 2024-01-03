import { PublishableDraft } from '@/layers/entity/types'
import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { deleteTagsSQL, insertTagsSQL, updateArticleSQL } from './query'

export type UpdateArticleReturnProps = {
  success: boolean
  error?: {
    id: 'not-exists' | 'invalid-data' | 'unknown'
    message: string
  }
}

const notExistsError: UpdateArticleReturnProps = {
  success: false,
  error: {
    id: 'not-exists',
    message: "The article doesn't exists",
  },
}

const createError = (error: any): UpdateArticleReturnProps => {
  const data: UpdateArticleReturnProps = {
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

export const updateArticle = async (
  data: PublishableDraft,
): Promise<UpdateArticleReturnProps> => {
  const tagInsertValues: string[][] = []
  if (data.tags) {
    data.tags.forEach((tag) => {
      tagInsertValues.push([data.id, tag])
    })
  }

  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      const updateResult: any[] = await connection.query(updateArticleSQL(), [
        data.title,
        data.description,
        data.content,
        data.id,
      ])

      const updateAffectedRows: number = updateResult[0].affectedRows

      if (updateAffectedRows <= 0) {
        await connection.rollback()
        return notExistsError
      }

      await connection.query(deleteTagsSQL(), [data.id])
      if (tagInsertValues.length > 0) {
        await connection.query(insertTagsSQL(), [tagInsertValues])
      }

      await connection.commit()

      const returnValue: UpdateArticleReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()
      return createError(error)
    }
  })
}
