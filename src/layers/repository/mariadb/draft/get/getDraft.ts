import withConnection from '../../connection/withConnection'
import { Draft } from '@/layers/entity/types'
import { getDraftQuery } from './query'

export type GetDraftReturnProps = {
  success: boolean
  data?: Draft
  error?: {
    id: 'not-exists' | 'too-many-rows-selected' | 'unknown'
    message: string
  }
}

const createError = (
  id: 'not-exists' | 'too-many-rows-selected' | 'unknown',
  message?: string,
): GetDraftReturnProps => {
  const data: GetDraftReturnProps = {
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
    data.error!.message = "The draft doesn't exists"
  } else if (id === 'too-many-rows-selected') {
    data.error!.message = 'Too many rows selected'
  }

  return data
}

export const getDraft = async (id: string): Promise<GetDraftReturnProps> => {
  return withConnection(async (connection) => {
    try {
      const result: any[] = await connection.query(getDraftQuery(), { id })

      const selectResults = result[0]
      if (selectResults.length <= 0) {
        return createError('not-exists')
      } else if (selectResults.length > 1) {
        return createError('too-many-rows-selected')
      }

      const rawData = selectResults[0]

      const draft: Draft = {
        id: rawData.id,
        title: rawData.title,
        content: rawData.content,
      }

      const returnValue: GetDraftReturnProps = {
        success: true,
        data: draft,
      }

      return returnValue
    } catch (error: any) {
      return createError('unknown', error.message)
    }
  })
}
