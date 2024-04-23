import { PublishableDraft } from '@/layers/entity/types'
import withConnection from '../../connection/withConnection'
import { PoolConnection, QueryError } from 'mysql2/promise'
import { insertArticleSQL, insertTagsSQL } from './query'

type ErrorId = 'already-exists' | 'invalid-data' | 'unknown'

export type CreateArticleReturnProps = {
  success: boolean
  error?: {
    id: ErrorId
    message?: string
  }
}

const createError = (error: QueryError): CreateArticleReturnProps => {
  const data: CreateArticleReturnProps = {
    success: false,
    error: {
      id: 'unknown',
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
  draft: PublishableDraft,
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

      await connection.query(insertArticleSQL, {
        id: draft.id,
        title: draft.title,
        description: draft.description,
        content: draft.content,
        isPublic: draft.isPublic,
      })

      if (tagInsertValues.length > 0) {
        await connection.query(insertTagsSQL, { items: tagInsertValues })
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
