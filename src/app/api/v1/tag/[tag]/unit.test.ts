jest.mock('@/layers/use-case/tag/TagUsesCase')
jest.mock('next-auth')

import { NextRequest, NextResponse } from 'next/server'
import { POST, DELETE } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { TagUseCase } from '@/layers/use-case/tag/interface'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'
import {
  TagAlreadyExistsError,
  TagExcessiveScopeError,
  TagInvalidDataError,
  TagNotFoundError,
} from '@/layers/use-case/tag/errors'
import { getServerSession } from 'next-auth'

const mockKeyMap = {
  success: 'success',
  notExists: 'not-exists',
  scopeError: 'scope-error',
  alreadyExists: 'already-exists',
  invalidData: 'invalid-data',
  error: 'error',
}

const tagUseCaseMock: TagUseCase = {
  createTag: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(true)
    } else if (id === mockKeyMap.invalidData) {
      return new Failure(new TagInvalidDataError(''))
    } else if (id === mockKeyMap.alreadyExists) {
      return new Failure(new TagAlreadyExistsError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  deleteTag: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockKeyMap.success) {
      return new Success(true)
    } else if (id === mockKeyMap.notExists) {
      return new Failure(new TagNotFoundError(''))
    } else if (id === mockKeyMap.scopeError) {
      return new Failure(new TagExcessiveScopeError(''))
    } else {
      return new Failure(new Error(''))
    }
  }),
  listTags: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
}

beforeAll(() => {
  const getTagUseCaseMock = getTagUseCase as jest.Mock
  getTagUseCaseMock.mockReturnValue(tagUseCaseMock)
})

describe('POST /api/v1/tag/[tag]', () => {
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

    const result: NextResponse<any> = await POST(req, {
      params: {
        tag: mockKeyMap.success,
      },
    })

    expect(result.status).toBe(401)
  })

  it('responds 200 (OK) and creates tag correctly', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const result: NextResponse<any> = await POST(req, {
      params: {
        tag: mockKeyMap.success,
      },
    })

    const createTagMock = tagUseCaseMock.createTag as jest.Mock

    expect(result.status).toBe(200)
    expect(createTagMock).toHaveBeenCalledTimes(1)
    expect(createTagMock.mock.calls[0][0]).toBe(mockKeyMap.success)
  })

  it('responds 409 (Conflict) when the tag already exists', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const result: NextResponse<any> = await POST(req, {
      params: {
        tag: mockKeyMap.alreadyExists,
      },
    })

    const createTagMock = tagUseCaseMock.createTag as jest.Mock

    expect(result.status).toBe(409)
    expect(createTagMock).toHaveBeenCalledTimes(2)
    expect(createTagMock.mock.calls[1][0]).toBe(mockKeyMap.alreadyExists)
  })

  it('responds 400 (Bad Request) when invalid tag name specified', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const result: NextResponse<any> = await POST(req, {
      params: {
        tag: mockKeyMap.invalidData,
      },
    })

    const createTagMock = tagUseCaseMock.createTag as jest.Mock

    expect(result.status).toBe(400)
    expect(createTagMock).toHaveBeenCalledTimes(3)
    expect(createTagMock.mock.calls[2][0]).toBe(mockKeyMap.invalidData)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const result: NextResponse<any> = await POST(req, {
      params: {
        tag: mockKeyMap.error,
      },
    })

    const createTagMock = tagUseCaseMock.createTag as jest.Mock

    expect(result.status).toBe(500)
    expect(createTagMock).toHaveBeenCalledTimes(4)
    expect(createTagMock.mock.calls[3][0]).toBe(mockKeyMap.error)
  })
})

describe('DELETE /api/v1/tag/[tag]', () => {
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

    const result: NextResponse<any> = await DELETE(req, {
      params: {
        tag: mockKeyMap.success,
      },
    })

    expect(result.status).toBe(401)
  })

  it('responds 200 (OK) and deletes tag correctly', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: {
        tag: mockKeyMap.success,
      },
    })

    const deleteTagMock = tagUseCaseMock.deleteTag as jest.Mock

    expect(result.status).toBe(200)
    expect(deleteTagMock).toHaveBeenCalledTimes(1)
    expect(deleteTagMock.mock.calls[0][0]).toBe(mockKeyMap.success)
  })

  it('responds 404 (Not Found) when the tag does not exists', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: {
        tag: mockKeyMap.notExists,
      },
    })

    const deleteTagMock = tagUseCaseMock.deleteTag as jest.Mock

    expect(result.status).toBe(404)
    expect(deleteTagMock).toHaveBeenCalledTimes(2)
    expect(deleteTagMock.mock.calls[1][0]).toBe(mockKeyMap.notExists)
  })

  it('responds 500 (Internal Server Error) when the tag has excessive scope', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: {
        tag: mockKeyMap.scopeError,
      },
    })

    const deleteTagMock = tagUseCaseMock.deleteTag as jest.Mock

    expect(result.status).toBe(500)
    expect(deleteTagMock).toHaveBeenCalledTimes(3)
    expect(deleteTagMock.mock.calls[2][0]).toBe(mockKeyMap.scopeError)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'DELETE',
    })

    const result: NextResponse<any> = await DELETE(req, {
      params: {
        tag: mockKeyMap.error,
      },
    })

    const deleteTagMock = tagUseCaseMock.deleteTag as jest.Mock

    expect(result.status).toBe(500)
    expect(deleteTagMock).toHaveBeenCalledTimes(4)
    expect(deleteTagMock.mock.calls[3][0]).toBe(mockKeyMap.error)
  })
})
