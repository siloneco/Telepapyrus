jest.mock('@/layers/use-case/article/ArticleUseCase')
jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import { NextRequest, NextResponse } from 'next/server'
import { DELETE, GET, POST } from './route'
import {
  PresentationArticle,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { ArticleUseCase } from '@/layers/use-case/article/interface'
import { Failure, Success } from '@/lib/utils/Result'
import { Draft, PublishableDraft } from '@/layers/entity/types'
import { getServerSession } from 'next-auth'
import { DraftUseCase } from '@/layers/use-case/draft/interface'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

const baseArticle: PresentationArticle = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  tags: ['tag1', 'tag2'],
  date: '2024/01/01',
  last_updated: '2024/01/01',
  isPublic: true,
} as const

const basePublishableDraft: PublishableDraft = {
  id: baseArticle.id,
  title: baseArticle.title,
  description: baseArticle.description,
  content: baseArticle.content,
  tags: baseArticle.tags,
  isPublic: true,
} as const

const mockKeyMap = {
  success: 'success',
  notExists: 'not-exists',
  scopeError: 'scope-error',
  alreadyExists: 'already-exists',
  invalidData: 'invalid-data',
  error: 'error',
}

const articleUseCaseMock: ArticleUseCase = {
  createArticle: jest.fn().mockImplementation(async (draft: Draft) => {
    if (draft.id === mockKeyMap.success) {
      return new Success(baseArticle)
    } else if (draft.id === mockKeyMap.alreadyExists) {
      return new Failure(new AlreadyExistsError(''))
    } else if (draft.id === mockKeyMap.invalidData) {
      return new Failure(new InvalidDataError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  getArticle: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(baseArticle)
    } else if (id === mockKeyMap.notExists) {
      return new Failure(new NotFoundError(''))
    } else if (id === mockKeyMap.scopeError) {
      return new Failure(new UnexpectedBehaviorDetectedError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  updateArticle: jest.fn().mockImplementation(async (draft: Draft) => {
    if (draft.id === mockKeyMap.success) {
      return new Success(baseArticle)
    } else if (draft.id === mockKeyMap.notExists) {
      return new Failure(new NotFoundError(''))
    } else if (draft.id === mockKeyMap.invalidData) {
      return new Failure(new InvalidDataError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  deleteArticle: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(baseArticle)
    } else if (id === mockKeyMap.notExists) {
      return new Failure(new NotFoundError(''))
    } else if (id === mockKeyMap.scopeError) {
      return new Failure(new UnexpectedBehaviorDetectedError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  countArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  listArticle: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

const draftUseCaseMock: DraftUseCase = {
  deleteDraft: jest.fn().mockImplementation(async (_id: string) => {
    return new Success(true)
  }),
  saveDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  listDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  changeDraftId: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  setDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  getDraftForPreview: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

beforeAll(() => {
  const getArticleUseCaseMock = getArticleUseCase as jest.Mock
  getArticleUseCaseMock.mockReturnValue(articleUseCaseMock)

  const getDraftUseCaseMock = getDraftUseCase as jest.Mock
  getDraftUseCaseMock.mockReturnValue(draftUseCaseMock)
})

describe('GET /api/v1/article/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const req = new NextRequest('http://localhost/')

    const getServerSessionMock = getServerSession as jest.Mock
    expect(getServerSessionMock.mock.calls).toHaveLength(0)

    const result: NextResponse<any> = await GET(req, {
      params: { id: baseArticle.id },
    })

    expect(result.status).toBe(401)
    expect(getServerSessionMock.mock.calls).toHaveLength(1)

    expect(articleUseCaseMock.getArticle).toHaveBeenCalledTimes(0)
  })

  it('responds 200 (OK) and correct article data', async () => {
    const req = new NextRequest('http://localhost/')

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.success },
    })

    expect(data.status).toBe(200)

    const responseJson = await data.json()
    expect(responseJson).toEqual(baseArticle)
  })

  it('responds 404 (Not Found) when the article not found', async () => {
    const req = new NextRequest('http://localhost/')

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.notExists },
    })

    expect(data.status).toBe(404)
  })

  it('responds 500 (Internal Server Error) when it detected illegal behaviour', async () => {
    const req = new NextRequest('http://localhost/')

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.scopeError },
    })

    expect(data.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when unkown error occured', async () => {
    const req = new NextRequest('http://localhost/')

    const data: NextResponse<any> = await GET(req, {
      params: { id: mockKeyMap.error },
    })

    expect(data.status).toBe(500)
  })
})

describe('POST /api/v1/article/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const getServerSessionMock = getServerSession as jest.Mock
    expect(getServerSessionMock.mock.calls).toHaveLength(0)

    const result: NextResponse<any> = await POST(req, {
      params: { id: baseArticle.id },
    })

    expect(result.status).toBe(401)
    expect(getServerSessionMock.mock.calls).toHaveLength(1)

    expect(articleUseCaseMock.createArticle).toHaveBeenCalledTimes(0)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(0)
  })

  it('responds 200 (OK) when article successfully posted', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify(basePublishableDraft),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.success },
    })

    expect(result.status).toBe(200)
    expect(articleUseCaseMock.createArticle).toHaveBeenCalledTimes(1)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(1)
  })

  it('responds 409 (Conflict) when article with the specified ID already exists', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify(basePublishableDraft),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.alreadyExists },
    })

    expect(result.status).toBe(409)
    expect(articleUseCaseMock.createArticle).toHaveBeenCalledTimes(2)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(1)
  })

  it('responds 400 (Bad Request) when article data is invalid (create)', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify(basePublishableDraft),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.invalidData },
    })
    expect(result.status).toBe(400)
    expect(articleUseCaseMock.createArticle).toHaveBeenCalledTimes(3)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(1)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify(basePublishableDraft),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.error },
    })

    expect(result.status).toBe(500)
    expect(articleUseCaseMock.createArticle).toHaveBeenCalledTimes(4)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(1)
  })

  it('responds 200 (OK) when article successfully updated', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...basePublishableDraft, update: true }),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.success },
    })

    expect(result.status).toBe(200)
    expect(articleUseCaseMock.updateArticle).toHaveBeenCalledTimes(1)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(2)
  })

  it('responds 404 (Not Found) when article with the specified ID not exists', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...basePublishableDraft, update: true }),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.notExists },
    })

    expect(result.status).toBe(404)
    expect(articleUseCaseMock.updateArticle).toHaveBeenCalledTimes(2)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(2)
  })

  it('responds 400 (Bad Request) when article data is invalid (update)', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...basePublishableDraft, update: true }),
    })

    const result: NextResponse<any> = await POST(req, {
      params: { id: mockKeyMap.invalidData },
    })
    expect(result.status).toBe(400)
    expect(articleUseCaseMock.updateArticle).toHaveBeenCalledTimes(3)
    expect(draftUseCaseMock.deleteDraft).toHaveBeenCalledTimes(2)
  })
})

describe('DELETE /api/v1/article/[id]', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you do not have permission', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const getServerSessionMock = getServerSession as jest.Mock
    expect(getServerSessionMock.mock.calls).toHaveLength(0)

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: baseArticle.id },
    })

    expect(result.status).toBe(401)
    expect(getServerSessionMock.mock.calls).toHaveLength(1)
  })

  it('responds 200 (OK) when article successfully deleted', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.success },
    })

    expect(result.status).toBe(200)
  })

  it('responds 404 (Not Found) when article not found', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.notExists },
    })

    expect(result.status).toBe(404)
  })

  it('responds 500 (Internal Server Error) when it detected illegal behaviour', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.scopeError },
    })
    expect(result.status).toBe(500)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: { id: mockKeyMap.error },
    })
    expect(result.status).toBe(500)
  })
})
