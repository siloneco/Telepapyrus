import withConnection from '../../connection/withConnection'
import { deleteArticleQuery } from './query'

export type DeleteArticleReturnProps = {
  success: boolean
  error?: {
    id: 'not-exists' | 'too-many-rows-affected' | 'unknown'
    message: string
  }
}

const createError = (
  id: 'not-exists' | 'too-many-rows-affected' | 'unknown',
  message?: string,
): DeleteArticleReturnProps => {
  const data: DeleteArticleReturnProps = {
    success: false,
    error: {
      id: id,
      message: 'Unknown error',
    },
  }

  if (message !== undefined) {
    data.error!.message = message
  }

  if (id === 'not-exists') {
    data.error!.message = "The article doesn't exists"
  } else if (id === 'too-many-rows-affected') {
    data.error!.message = 'Too much rows affected'
  }

  return data
}

export const deleteArticle = async (
  id: string,
): Promise<DeleteArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      await connection.beginTransaction()
      const deleteResult: any[] = await connection.query(deleteArticleQuery(), {
        id,
      })

      const affectedRows: number = deleteResult[0].affectedRows

      if (affectedRows !== 1) {
        await connection.rollback()

        if (affectedRows <= 0) return createError('not-exists')
        if (affectedRows > 1) return createError('too-many-rows-affected')
      }

      await connection.commit()
      return { success: true }
    } catch (error: any) {
      await connection.rollback()
      return createError('unknown', error.message)
    }
  })
}
