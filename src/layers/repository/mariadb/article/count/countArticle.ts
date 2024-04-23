import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { countAllQuery, countWithTagsQuery } from './query'

export type CountArticleReturnProps = {
  success: boolean
  data?: number
  error?: {
    id: 'too-many-rows-selected' | 'invalid-data-queried' | 'unknown'
    message?: string
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
      message,
    },
  }

  return data
}

const queryAll = async (
  connection: PoolConnection,
  includePrivateArticles: boolean,
): Promise<any[]> => {
  return await connection.query(countAllQuery, { includePrivateArticles })
}

const queryWithTags = async (
  connection: PoolConnection,
  tags: string[],
  includePrivateArticles: boolean,
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(countWithTagsQuery, {
    tags: distinctTags,
    amountOfTags: distinctTags.length,
    includePrivateArticles,
  })
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  tags?: string[],
  includePrivateArticles: boolean = false,
): Promise<any[]> => {
  const haveTags = tags !== undefined && tags.length > 0

  if (!haveTags) {
    return await queryAll(connection, includePrivateArticles)
  } else {
    return await queryWithTags(connection, tags!, includePrivateArticles)
  }
}

export const countArticle = async (
  tags?: string[],
  includePrivateArticles?: boolean,
): Promise<CountArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        tags,
        includePrivateArticles,
      )

      const resultRows = resultsWithColumnData[0]

      if (resultRows.length !== 1) {
        return createError('too-many-rows-selected')
      }

      const count: number = resultRows[0]['count']

      if (count === undefined || count < 0) {
        return createError('invalid-data-queried')
      }

      const returnValue: CountArticleReturnProps = {
        success: true,
        data: count,
      }

      return returnValue
    } catch (error: any) {
      return createError('unknown', error.message)
    }
  })
}
