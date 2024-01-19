jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import { NextRequest, NextResponse } from 'next/server'
import { GET } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { DraftUseCase } from '@/layers/use-case/draft/interface'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftOverview } from '@/layers/entity/types'
import { getServerSession } from 'next-auth'

const mockData: DraftOverview = {
  id: 'id',
  title: 'title',
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
  setDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  listDraft: jest
    .fn()
    .mockReturnValueOnce(new Success([mockData])) // First test will check success behaviour
    .mockReturnValueOnce(new Failure(new Error(''))) // Second test will check failure behaviour
    .mockReturnValue(new Success([mockData])), // Third or later test will check success behaviour
}

beforeAll(() => {
  const getDraftUseCaseMock = getDraftUseCase as jest.Mock
  getDraftUseCaseMock.mockReturnValue(draftUseCaseMock)
})

describe('GET /api/v1/draft/list', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const req = new NextRequest(`http://localhost/`)

    const listDraftMock = draftUseCaseMock.listDraft as jest.Mock

    const data: NextResponse<any> = await GET(req)

    expect(data.status).toBe(401)
    expect(listDraftMock.mock.calls).toHaveLength(0)
  })

  it('responds 200 (OK) and correct list of draft data', async () => {
    const page = 1

    const searchParams = new URLSearchParams()
    searchParams.set('page', `${page}`)
    const req = new NextRequest(`http://localhost/?${searchParams.toString()}`)

    const listDraftMock = draftUseCaseMock.listDraft as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson).toEqual([mockData])

    const callLength = 1
    expect(listDraftMock.mock.calls).toHaveLength(callLength)
    expect(listDraftMock.mock.calls[callLength - 1][0]).toEqual(page)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const page = 1

    const searchParams = new URLSearchParams()
    searchParams.set('page', `${page}`)
    const req = new NextRequest(`http://localhost/?${searchParams.toString()}`)

    const listDraftMock = draftUseCaseMock.listDraft as jest.Mock

    const result: NextResponse<any> = await GET(req)

    expect(result.status).toBe(500)
    expect(listDraftMock.mock.calls).toHaveLength(2)
  })

  it('responds 200 (OK) with page 1 selected even if page is not specified', async () => {
    const req = new NextRequest(`http://localhost/`)

    const listDraftMock = draftUseCaseMock.listDraft as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson).toEqual([mockData])

    const callLength = 3
    expect(listDraftMock.mock.calls).toHaveLength(callLength)
    expect(listDraftMock.mock.calls[callLength - 1][0]).toEqual(1)
  })

  it('responds 400 (Bad Request) when page number is negative', async () => {
    const page = -1

    const searchParams = new URLSearchParams()
    searchParams.set('page', `${page}`)
    const req = new NextRequest(`http://localhost/?${searchParams.toString()}`)

    const result: NextResponse<any> = await GET(req)

    expect(result.status).toBe(400)
  })

  it('calls usecase.listDraft with correct page number', async () => {
    const page = 5

    const searchParams = new URLSearchParams()
    searchParams.set('page', `${page}`)
    const req = new NextRequest(`http://localhost/?${searchParams.toString()}`)

    const listDraftMock = draftUseCaseMock.listDraft as jest.Mock

    await GET(req)

    const callLength = 4
    expect(listDraftMock.mock.calls).toHaveLength(callLength)
    expect(listDraftMock.mock.calls[callLength - 1][0]).toEqual(page)
  })
})
