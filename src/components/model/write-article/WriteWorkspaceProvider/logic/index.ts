import { ChangeDraftIdRequestProps } from '@/app/api/v1/draft/change-id/route'
import { Draft } from '@/layers/entity/types'

const roundOneDecimal = (num: number) => {
  return Math.round(num * 10) / 10
}

export const estimateMinToRead = (content: string) => {
  if (content === null || content === undefined) {
    return 0
  }

  let min = 0
  let isInsideCodeBlock: boolean = false

  const lines: string[] = content.split('\n')

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (isInsideCodeBlock && line !== '```') {
        continue
      }

      isInsideCodeBlock = !isInsideCodeBlock
      continue
    }

    if (isInsideCodeBlock) {
      continue
    }

    min += line.length / 500
  }

  return roundOneDecimal(min)
}

export const getBaseURL = () => {
  const protocol = window.location.protocol
  const host = window.location.host

  return `${protocol}//${host}`
}

export const sendPreviewData = async (data: Draft): Promise<boolean> => {
  const res = await fetch(`${getBaseURL()}/api/v1/draft/preview`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return res.status === 200
}

export const changeIdRequest = async (oldId: string, newId: string) => {
  const body: ChangeDraftIdRequestProps = {
    oldId,
    newId,
  }

  const res = await fetch(`${getBaseURL()}/api/v1/draft/change-id`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return res.status === 200
}

export const saveDraft = async (data: Draft): Promise<boolean> => {
  const res = await fetch(`${getBaseURL()}/api/v1/draft/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res.status === 200
}

export const postDraftForCreate = async (data: Draft): Promise<boolean> => {
  console.log('Creating...')
  const res = await fetch(`${getBaseURL()}/api/v1/article/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res.status === 200
}

export const postDraftForUpdate = async (data: Draft): Promise<boolean> => {
  console.log('Updating...')
  const res = await fetch(`${getBaseURL()}/api/v1/article/${data.id}`, {
    method: 'POST',
    body: JSON.stringify({ ...data, update: true }),
  })

  return res.status === 200
}
