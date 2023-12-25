jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import httpMocks from 'node-mocks-http'
import { NextResponse } from 'next/server'
import { DELETE, GET, POST } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { Draft } from '@/layers/entity/types'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftUseCase } from '@/layers/use-case/draft/interface'
import {
  DraftExcessiveScopeError,
  DraftInvalidDataError,
  DraftNotFoundError,
} from '@/layers/use-case/draft/errors'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
  public: true,
  tags: [],
}

const mockKeyMap = {
  success: 'success',
  notExists: 'not-exists',
  scopeError: 'scope-error',
  alreadyExists: 'already-exists',
  invalidData: 'invalid-data',
  error: 'error',
}

const draftUseCaseMock: DraftUseCase = {
  saveDraft: jest.fn().mockImplementation(async (draft: Draft) => {
    if (draft.id === mockKeyMap.success) {
      return new Success(true)
    } else if (draft.id === mockKeyMap.invalidData) {
      return new Failure(new DraftInvalidDataError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  getDraft: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(baseData)
    } else if (id === mockKeyMap.notExists) {
      return new Failure(new DraftNotFoundError(''))
    } else if (id === mockKeyMap.scopeError) {
      return new Failure(new DraftExcessiveScopeError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  deleteDraft: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(true)
    } else if (id === mockKeyMap.notExists) {
      return new Failure(new DraftNotFoundError(''))
    } else if (id === mockKeyMap.scopeError) {
      return new Failure(new DraftExcessiveScopeError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  setDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

beforeAll(() => {
  const getDraftUseCaseMock = getDraftUseCase as jest.Mock
  getDraftUseCaseMock.mockReturnValue(draftUseCaseMock)
})

describe('GET /api/v1/draft/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you does not have permission', async () => {
    const { req } = httpMocks.createMocks({
      method: 'GET',
    })

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.success },
    })

    expect(data.status).toBe(401)
  })

  it('responds 200 (OK) and correct draft data', async () => {
    const { req } = httpMocks.createMocks({
      method: 'GET',
    })

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.success },
    })

    expect(data.status).toBe(200)

    const responseJson = await data.json()
    expect(responseJson).toEqual(baseData)
  })

  it('responds 404 (Not Found) when the draft not found', async () => {
    const { req } = httpMocks.createMocks({
      method: 'GET',
    })

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.notExists },
    })

    expect(data.status).toBe(404)
  })

  it('responds 500 (Internal Server Error) when it detected illegal behaviour', async () => {
    const { req } = httpMocks.createMocks({
      method: 'GET',
    })

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.scopeError },
    })

    expect(data.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when unkown error occured', async () => {
    const { req } = httpMocks.createMocks({
      method: 'GET',
    })

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.error },
    })

    expect(data.status).toBe(500)
  })
})

describe('POST /api/v1/draft/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const { req } = httpMocks.createMocks({
      method: 'POST',
    })

    const getServerSessionMock = getServerSession as jest.Mock
    expect(getServerSessionMock.mock.calls).toHaveLength(0)

    const result: NextResponse<any> = await POST(req, {
      params: { id: baseData.id },
    })

    expect(result.status).toBe(401)
    expect(getServerSessionMock).toHaveBeenCalledTimes(1)
  })

  it('responds 200 (OK) when draft successfully posted', async () => {
    const { req } = httpMocks.createMocks({
      method: 'POST',
      json: async () => Promise.resolve(baseData),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.success },
    })

    expect(result.status).toBe(200)
  })

  it('responds 400 (Bad Request) when draft data is invalid', async () => {
    const { req } = httpMocks.createMocks({
      method: 'POST',
      json: async () => Promise.resolve(baseData),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.invalidData },
    })
    expect(result.status).toBe(400)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const { req } = httpMocks.createMocks({
      method: 'POST',
      json: async () => Promise.resolve(baseData),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.error },
    })
    expect(result.status).toBe(500)
  })
})

describe('DELETE /api/v1/draft/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const { req } = httpMocks.createMocks({
      method: 'DELETE',
    })

    const getServerSessionMock = getServerSession as jest.Mock
    expect(getServerSessionMock.mock.calls).toHaveLength(0)

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: baseData.id },
    })

    expect(result.status).toBe(401)
    expect(getServerSessionMock.mock.calls).toHaveLength(1)
  })

  it('responds 200 (OK) when draft successfully deleted', async () => {
    const { req } = httpMocks.createMocks({
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.success },
    })

    expect(result.status).toBe(200)
  })

  it('responds 404 (Not Found) when draft not found', async () => {
    const { req } = httpMocks.createMocks({
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.notExists },
    })

    expect(result.status).toBe(404)
  })

  it('responds 500 (Internal Server Error) when it detected illegal behaviour', async () => {
    const { req } = httpMocks.createMocks({
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.scopeError },
    })
    expect(result.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const { req } = httpMocks.createMocks({
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.error },
    })
    expect(result.status).toBe(500)
  })
})
