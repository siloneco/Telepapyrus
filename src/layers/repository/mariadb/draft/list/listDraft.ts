import withConnection from '../../connection/withConnection'
import { DraftOverview } from '@/layers/entity/types'
import { listAllQuery, listAllWithPageQuery } from './query'
import { PoolConnection } from 'mysql2/promise'

export type ListDraftReturnProps = {
  success: boolean
  data?: DraftOverview[]
  error?: {
    id: 'unknown'
    message: string
  }
}

const createError = (message?: string): ListDraftReturnProps => {
  const data: ListDraftReturnProps = {
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
  const offset = (page - 1) * 10
  return await connection.query(listAllWithPageQuery, { offset })
}

const executeWithPreferQuery = async (
  connection: PoolConnection,
  page?: number,
): Promise<any[]> => {
  if (page === undefined) {
    return await queryAll(connection)
  }

  return await queryWithPage(connection, page)
}

export const listDraft = async (
  page?: number,
): Promise<ListDraftReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const resultsWithColumnData: any[] = await executeWithPreferQuery(
        connection,
        page,
      )

      const rawResults = resultsWithColumnData[0]
      const results: DraftOverview[] = []

      for (const data of rawResults) {
        const draft: DraftOverview = {
          id: data.id,
          title: data.title,
        }

        results.push(draft)
      }

      const returnValue: ListDraftReturnProps = {
        success: true,
        data: results,
      }

      return returnValue
    } catch (error: any) {
      return createError(error.message)
    }
  })
}
