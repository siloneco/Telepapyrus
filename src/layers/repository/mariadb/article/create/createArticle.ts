import { Draft } from '@/layers/entity/types'
import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { insertArticleSQL, insertTagsSQL } from './query'

export type CreateArticleReturnProps = {
  success: boolean
  error?: {
    id: 'already-exists' | 'invalid-data' | 'unknown'
    message: string
  }
}

const createError = (error: any): CreateArticleReturnProps => {
  const data: CreateArticleReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: error.message,
    },
  }

  if (error.code === 'ER_DUP_ENTRY') {
    data.error!.id = 'already-exists'
  } else if (
    error.code === 'ER_DATA_TOO_LONG' ||
    error.code === 'ER_NO_REFERENCED_ROW_2'
  ) {
    data.error!.id = 'invalid-data'
  }

  return data
}

export const createArticle = async (
  draft: Draft,
): Promise<CreateArticleReturnProps> => {
  const tagInsertValues: string[][] = []
  if (draft.tags) {
    draft.tags.forEach((tag) => {
      tagInsertValues.push([draft.id, tag])
    })
  }

  return await withConnection(async (connection: PoolConnection) => {
    try {
      await connection.beginTransaction()

      await connection.query(insertArticleSQL, [
        draft.id,
        draft.title,
        draft.description,
        draft.content,
      ])

      if (tagInsertValues.length > 0) {
        await connection.query(insertTagsSQL, [tagInsertValues])
      }

      await connection.commit()

      const returnValue: CreateArticleReturnProps = { success: true }
      return returnValue
    } catch (error: any) {
      await connection.rollback()

      return createError(error)
    }
  })
}
