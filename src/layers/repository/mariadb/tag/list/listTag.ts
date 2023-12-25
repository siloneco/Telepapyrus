import withConnection from '../../connection/withConnection'
import { PoolConnection } from 'mysql2/promise'
import { listTagsSQL } from './query'

export type ListTagsReturnProps = {
  success: boolean
  data?: string[]
  error?: {
    id: 'unknown'
    message: string
  }
}

const createError = (error: any): ListTagsReturnProps => {
  const data: ListTagsReturnProps = {
    success: false,
    error: {
      id: 'unknown',
      message: error.message,
    },
  }

  return data
}

export const listTags = async (): Promise<ListTagsReturnProps> => {
  return await withConnection(async (connection: PoolConnection) => {
    try {
      const result: any[] = await connection.query(listTagsSQL)

      const selectResults: [{ tag: string }] = result[0]

      const resultArray: string[] = []
      selectResults.forEach((row) => {
        resultArray.push(row.tag)
      })

      const returnValue: ListTagsReturnProps = {
        success: true,
        data: resultArray,
      }
      return returnValue
    } catch (error: any) {
      return createError(error)
    }
  })
}
