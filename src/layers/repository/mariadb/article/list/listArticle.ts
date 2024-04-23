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
  includePrivateArticles?: boolean
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

const queryAll = async (
  connection: PoolConnection,
  includePrivateArticles: boolean,
): Promise<any[]> => {
  return await connection.query(listAllQuery, { includePrivateArticles })
}

const queryWithPage = async (
  connection: PoolConnection,
  page: number,
): Promise<any[]> => {
  return await connection.query(listAllWithPageQuery, { page })
}

const queryWithTags = async (
  connection: PoolConnection,
  tags: string[],
  page: number,
): Promise<any[]> => {
  const distinctTags = tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index
  })

  return await connection.query(listAllWithTagsAndPageQuery, {
    tags: distinctTags,
    amountOfTags: distinctTags.length,
    offset: 10 * (page - 1),
  })
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  includePrivateArticles: boolean,
  tags?: string[],
  page?: number,
): Promise<any[]> => {
  const havePage = page !== undefined
  const haveTags = tags !== undefined && tags.length > 0

  if (!havePage && !haveTags) {
    return await queryAll(connection, includePrivateArticles)
  } else if (havePage && !haveTags) {
    if (includePrivateArticles) {
      throw new Error(
        'Not implemented: including unlisted articles with page is not supported.',
      )
    }
    return await queryWithPage(connection, page!)
  } else if (havePage && haveTags) {
    if (includePrivateArticles) {
      throw new Error(
        'Not implemented: including unlisted articles with page and tags is not supported.',
      )
    }
    return await queryWithTags(connection, tags!, page!)
  } else {
    // !havePage && haveTags
    throw new Error('Not implemented yet.')
  }
}

export const listArticle = async ({
  tags,
  page,
  includePrivateArticles = false,
}: ListArticleProps): Promise<ListArticleReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        includePrivateArticles,
        tags,
        page,
      )

      const rawResults = resultsWithColumnData[0]
      const results: ArticleOverview[] = []

      for (const data of rawResults) {
        const rawTags: string | null = data.tags
        const overview: ArticleOverview = {
          id: data.id,
          title: data.title,
          description: data.description,
          tags: rawTags ? rawTags.split(',') : [],
          date: data.date,
          last_updated: data.last_updated,
          isPublic: data.public === 1,
        }

        results.push(overview)
      }

      const returnValue: ListArticleReturnProps = {
        success: true,
        data: results,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
