import { Draft } from '@/layers/entity/types'
import { setData } from '../data'

export type SetDraftForPreviewReturnProps = {
  success: boolean
  error?: {
    id: 'unknown'
    message: string
  }
}

const createUnknownError = (msg?: string): SetDraftForPreviewReturnProps => {
  const errorMessage = msg ? msg : 'unknown error'
  return { success: false, error: { id: 'unknown', message: errorMessage } }
}

export const setDraftForPreview = async (
  draft: Draft,
): Promise<SetDraftForPreviewReturnProps> => {
  try {
    const result: boolean = setData(draft.id, draft)
    if (result === false) {
      return createUnknownError()
    }

    return { success: true }
  } catch (e: any) {
    return createUnknownError(e.message)
  }
}
