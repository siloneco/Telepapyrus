jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import { PUT } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { Draft } from '@/layers/entity/types'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftUseCase } from '@/layers/use-case/draft/interface'
import { NextRequest } from 'next/server'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
}

const mockKeyMap = {
  success: 'success',
  error: 'error',
}

const draftUseCaseMock: DraftUseCase = {
  saveDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  deleteDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  setDraftForPreview: jest.fn().mockImplementation(async (draft: Draft) => {
    if (draft.id === mockKeyMap.success) {
      return new Success(true)
    } else {
      return new Failure(new Error(''))
    }
  }),
  getDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

beforeAll(() => {
  const getDraftUseCaseMock = getDraftUseCase as jest.Mock
  getDraftUseCaseMock.mockReturnValue(draftUseCaseMock)
})

describe('PUT /api/v1/draft/preview', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you does not have permission', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'PUT',
      body: JSON.stringify(baseData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(401)
  })

  it('responds 204 (No Content) when it successfully stored data', async () => {
    const draftData = { ...baseData, id: mockKeyMap.success }

    const req = new NextRequest('http://localhost/', {
      method: 'PUT',
      body: JSON.stringify(draftData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(204)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const draftData = { ...baseData, id: mockKeyMap.error }

    const req = new NextRequest('http://localhost/', {
      method: 'PUT',
      body: JSON.stringify(draftData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(500)
  })
})
