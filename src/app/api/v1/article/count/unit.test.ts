jest.mock('@/layers/use-case/article/ArticleUseCase')

import httpMocks from 'node-mocks-http'
import { NextResponse } from 'next/server'
import { GET } from './route'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import { ArticleUseCase } from '@/layers/use-case/article/interface'
import { Failure, Success } from '@/lib/utils/Result'
import {
  ArticleExcessiveScopeError,
  ArticleUnexpectedReturnValueError,
} from '@/layers/use-case/article/errors'

const mockKeyMap = {
  success: 'success',
  scopeError: 'scope-error',
  invalidReturnValueError: 'invalid-return-value-error',
  error: 'error',
}

const articleUseCaseMock: ArticleUseCase = {
  createArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  updateArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  deleteArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  countArticle: jest.fn().mockImplementation(async (tags?: string[]) => {
    if (tags === undefined) {
      return new Success(1)
    } else if (tags[0] === mockKeyMap.success) {
      return new Success(2)
    } else if (tags[0] === mockKeyMap.scopeError) {
      return new Failure(new ArticleExcessiveScopeError(''))
    } else if (tags[0] === mockKeyMap.invalidReturnValueError) {
      return new Failure(new ArticleUnexpectedReturnValueError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  listArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

beforeAll(() => {
  const getArticleUseCaseWithoutTypeDef = getArticleUseCase as any
  getArticleUseCaseWithoutTypeDef.mockReturnValue(articleUseCaseMock)
})

describe('GET /api/v1/count', () => {
  it('responds 200 (OK) and correct data', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const countArticleMock = articleUseCaseMock.countArticle as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson.count).toEqual(1)

    const callLength = 1
    expect(countArticleMock.mock.calls).toHaveLength(callLength)
    expect(countArticleMock.mock.calls[callLength - 1][0]).toEqual(undefined)
  })

  it('responds 200 (OK) and correct data when tags specified', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', mockKeyMap.success)

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const countArticleMock = articleUseCaseMock.countArticle as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson.count).toEqual(2)

    const callLength = 2
    expect(countArticleMock.mock.calls).toHaveLength(callLength)
    expect(countArticleMock.mock.calls[callLength - 1][0]).toEqual([
      mockKeyMap.success,
    ])
  })

  it('responds 500 (Internal Server Error) when invalid data returned', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', mockKeyMap.invalidReturnValueError)

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const data: NextResponse<any> = await GET(req)

    expect(data.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when it detects illegal behaviour', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', mockKeyMap.scopeError)

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const data: NextResponse<any> = await GET(req)

    expect(data.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', mockKeyMap.error)

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const data: NextResponse<any> = await GET(req)

    expect(data.status).toBe(500)
  })
})
