import withConnection from '../../connection/withConnection'
import { Article } from '@/layers/entity/types'
import { getArticleQuery } from './query'

export type GetArticleReturnProps = {
  success: boolean
  data?: Article
  error?: {
    id: 'not-exists' | 'too-many-rows-selected' | 'unknown'
    message: string
  }
}

const createError = (
  id: 'not-exists' | 'too-many-rows-selected' | 'unknown',
  message?: string,
): GetArticleReturnProps => {
  const data: GetArticleReturnProps = {
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
  } else if (id === 'too-many-rows-selected') {
    data.error!.message = 'Too many rows selected'
  }

  return data
}

export const getArticle = async (
  id: string,
): Promise<GetArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const result: any[] = await connection.query(getArticleQuery(), [id, id])

      const selectResults = result[0]
      if (selectResults.length <= 0) {
        return createError('not-exists')
      } else if (selectResults.length > 1) {
        return createError('too-many-rows-selected')
      }

      const rawData = selectResults[0]

      const article: Article = {
        id: rawData.id,
        title: rawData.title,
        content: rawData.content,
        tags: rawData.tag ? rawData.tag.split(',') : [],
        public: true, // Edit this when you implement private article
        date: rawData.date,
        last_updated: rawData.last_updated,
      }

      const returnValue: GetArticleReturnProps = {
        success: true,
        data: article,
      }

      return returnValue
    } catch (error: any) {
      return createError('unknown', error.message)
    }
  })
}
