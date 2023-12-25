jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import httpMocks from 'node-mocks-http'
import { PUT } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { Draft } from '@/layers/entity/types'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftUseCase } from '@/layers/use-case/draft/interface'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
  public: true,
  tags: [],
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
    const { req } = httpMocks.createMocks({
      method: 'PUT',
      json: async () => Promise.resolve(baseData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(401)
  })

  it('responds 204 (No Content) when it successfully stored data', async () => {
    const draftData = { ...baseData, id: mockKeyMap.success }

    const { req } = httpMocks.createMocks({
      method: 'PUT',
      json: async () => Promise.resolve(draftData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(204)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const draftData = { ...baseData, id: mockKeyMap.error }

    const { req } = httpMocks.createMocks({
      method: 'PUT',
      json: async () => Promise.resolve(draftData),
    })

    const data: Response = await PUT(req)

    expect(data.status).toBe(500)
  })
})
