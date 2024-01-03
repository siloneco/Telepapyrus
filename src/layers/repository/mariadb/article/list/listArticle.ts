import withConnection from '../../connection/withConnection'
import { ArticleOverview } from '@/layers/entity/types'
import {
  listAllQuery,
  listAllWithPageQuery,
  listAllWithTagsAndPageQuery,
} from './query'
import { PoolConnection } from 'mysql2/promise'

export type ListArticleProps = {
  tags?: string[]
  page?: number
}

export type ListArticleReturnProps = {
  success: boolean
  data?: ArticleOverview[]
  error?: {
    id: 'unknown'
    message: string
  }
}

const createError = (message?: string): ListArticleReturnProps => {
  const data: ListArticleReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: 'Unknown error',
    },
  }

  if (message !== undefined) {
    data.error!.message = message
  }

  return data
}

const queryAll = async (connection: PoolConnection): Promise<any[]> => {
  return await connection.query(listAllQuery)
}

const queryWithPage = async (
  connection: PoolConnection,
  page: number,
): Promise<any[]> => {
  return await connection.query(listAllWithPageQuery, [page, page])
}

const queryWithTags = async (
  connection: PoolConnection,
  tags: string[],
  page: number,
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(listAllWithTagsAndPageQuery, [
    distinctTags,
    distinctTags.length,
    10 * (page - 1),
  ])
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  tags?: string[],
  page?: number,
): Promise<any[]> => {
  const havePage = page !== undefined
  const haveTags = tags !== undefined && tags.length > 0

  if (!havePage && !haveTags) {
    return await queryAll(connection)
  } else if (havePage && !haveTags) {
    return await queryWithPage(connection, page!)
  } else if (havePage && haveTags) {
    return await queryWithTags(connection, tags!, page!)
  } else {
    // !havePage && haveTags
    throw new Error('Not implemented yet.')
  }
}

export const listArticle = async ({
  tags,
  page,
}: ListArticleProps): Promise<ListArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        tags,
        page,
      )

      const results = resultsWithColumnData[0]

      for (let i = 0; i < results.length; i++) {
        results[i].public = true // Edit this when you implement private article

        const tagStr: string = results[i].tags
        if (tagStr == null) {
          results[i].tags = []
          continue
        }

        results[i].tags = tagStr.split(',')
      }

      const returnValue: ListArticleReturnProps = {
        success: true,
        data: results!,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
