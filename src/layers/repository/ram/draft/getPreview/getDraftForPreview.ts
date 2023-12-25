import { Draft } from '@/layers/entity/types'
import { getData } from '../data'

type ErrorIDs = 'not-exists' | 'unknown'

export type GetDraftForPreviewReturnProps = {
  success: boolean
  data?: Draft
  error?: {
    id: ErrorIDs
    message: string
  }
}

const createError = (
  id: ErrorIDs,
  msg: string = 'unknown error',
): GetDraftForPreviewReturnProps => {
  return { success: false, error: { id, message: msg } }
}

export const getDraftForPreview = async (
  id: string,
): Promise<GetDraftForPreviewReturnProps> => {
  try {
    const result: Draft | null = getData(id)
    if (result === null) {
      return createError('not-exists')
    }

    return { success: true, data: result }
  } catch (e: any) {
    return createError('unknown', e.message)
  }
}
