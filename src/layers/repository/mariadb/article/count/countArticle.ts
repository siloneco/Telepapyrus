import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { countAllQuery, countWithTagsQuery } from './query'

export type CountArticleReturnProps = {
  success: boolean
  data?: number
  error?: {
    id: 'too-many-rows-selected' | 'invalid-data-queried' | 'unknown'
    message: string
  }
}

const createError = (
  id: 'too-many-rows-selected' | 'invalid-data-queried' | 'unknown',
  message?: string,
): CountArticleReturnProps => {
  const data: CountArticleReturnProps = {
    success: false,
    error: {
      id,
      message: 'Unknown error',
    },
  }

  if (message !== undefined) {
    data.error!.message = message
  }

  return data
}

const queryAll = async (connection: PoolConnection): Promise<any[]> => {
  return await connection.query(countAllQuery)
}

const queryWithTags = async (
  connection: PoolConnection,
  tags: string[],
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(countWithTagsQuery, [
    distinctTags,
    distinctTags.length,
  ])
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  tags?: string[],
): Promise<any[]> => {
  const haveTags = tags !== undefined && tags.length > 0

  if (!haveTags) {
    return await queryAll(connection)
  } else {
    return await queryWithTags(connection, tags!)
  }
}

export const countArticle = async (
  tags?: string[],
): Promise<CountArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        tags,
      )

      const resultRows = resultsWithColumnData[0]

      if (resultRows.length !== 1) {
        return createError('too-many-rows-selected', 'Too many rows queried')
      }

      const count: number = resultRows[0]['count']

      if (count === undefined || count < 0) {
        return createError('invalid-data-queried', 'Invalid data queried')
      }

      const returnValue: CountArticleReturnProps = {
        success: true,
        data: count,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
