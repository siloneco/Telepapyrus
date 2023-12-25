jest.mock('@/layers/use-case/article/ArticleUseCase')

import httpMocks from 'node-mocks-http'
import { NextResponse } from 'next/server'
import { GET } from './route'
import {
  PresentationArticle,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { ArticleUseCase } from '@/layers/use-case/article/interface'
import { Failure, Success } from '@/lib/utils/Result'

const baseData: PresentationArticle = {
  id: 'id',
  title: 'title',
  content: 'content',
  tags: ['tag1', 'tag2'],
  date: '2024/01/01',
  last_updated: '2024/01/01',
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
  countArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  listArticle: jest
    .fn()
    .mockReturnValueOnce(new Success([baseData])) // First test will check success behaviour
    .mockReturnValueOnce(new Failure(new Error(''))) // Second test will check failure behaviour
    .mockReturnValue(new Success([baseData])), // Third or later test will check success behaviour
}

beforeAll(() => {
  const getArticleUseCaseMock = getArticleUseCase as jest.Mock
  getArticleUseCaseMock.mockReturnValue(articleUseCaseMock)
})

describe('GET /api/v1/article/list', () => {
  it('responds 200 (OK) and correct list of article data', async () => {
    const tag = 'tmp-test-api-list-success-tag'
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', tag)

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const listArticleMock = articleUseCaseMock.listArticle as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson).toEqual([baseData])

    const callLength = 1
    expect(listArticleMock.mock.calls).toHaveLength(callLength)
    expect(listArticleMock.mock.calls[callLength - 1][0]).toEqual({
      tags: [tag],
      page: 1,
    })
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('page', '1')

    const { req } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const listArticleMock = articleUseCaseMock.listArticle as jest.Mock

    const result: NextResponse<any> = await GET(req)

    expect(result.status).toBe(500)
    expect(listArticleMock.mock.calls).toHaveLength(2)
  })

  it('responds 400 (Bad Request) when page number is negative', async () => {
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('page', '-1')

    const { req: pageReq } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const result: NextResponse<any> = await GET(pageReq)

    expect(result.status).toBe(400)
  })

  it('calls usecase.listArticle with correct page number', async () => {
    const page = 5

    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('page', page.toString())

    const { req: pageReq } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const listArticleMock = articleUseCaseMock.listArticle as jest.Mock

    await GET(pageReq)

    const callLength = 3
    expect(listArticleMock.mock.calls).toHaveLength(callLength)
    expect(listArticleMock.mock.calls[callLength - 1][0]).toEqual({
      page: page,
    })
  })

  it('calls usecase.listArticle with correct tags list', async () => {
    const tagBase = 'tmp-test-api-list-tag-'
    const searchParams: URLSearchParams = new URLSearchParams()
    searchParams.set('tags', `${tagBase}-1,${tagBase}-2,${tagBase}-3`)

    const { req: pageReq } = httpMocks.createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: searchParams,
      },
    })

    const listArticleMock = articleUseCaseMock.listArticle as jest.Mock

    await GET(pageReq)

    const callLength = 4
    expect(listArticleMock.mock.calls).toHaveLength(callLength)
    expect(listArticleMock.mock.calls[callLength - 1][0]).toEqual({
      page: 1,
      tags: [`${tagBase}-1`, `${tagBase}-2`, `${tagBase}-3`],
    })
  })
})
