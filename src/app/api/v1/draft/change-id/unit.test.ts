jest.mock('@/layers/use-case/draft/DraftUsesCase')
jest.mock('next-auth')

import { NextRequest, NextResponse } from 'next/server'
import { ChangeDraftIdRequestProps, POST } from './route'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { DraftUseCase } from '@/layers/use-case/draft/interface'
import { Failure, Success } from '@/lib/utils/Result'
import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

const mockKeyMap = {
  success: 'success',
  notExists: 'not-exists',
  illegalBehavior: 'illegal-behavior',
  alreadyExists: 'already-exists',
  invalidData: 'invalid-data',
  error: 'error',
}

const baseRequest: ChangeDraftIdRequestProps = {
  oldId: mockKeyMap.success,
  newId: 'new-id',
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
  listDraft: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  changeDraftId: jest
    .fn()
    .mockImplementation(async (oldId: string, _newId: string) => {
      if (oldId === mockKeyMap.success) {
        return new Success(true)
      } else if (oldId === mockKeyMap.notExists) {
        return new Failure(new NotFoundError(''))
      } else if (oldId === mockKeyMap.illegalBehavior) {
        return new Failure(new UnexpectedBehaviorDetectedError(''))
      } else if (oldId === mockKeyMap.alreadyExists) {
        return new Failure(new AlreadyExistsError(''))
      } else if (oldId === mockKeyMap.invalidData) {
        return new Failure(new InvalidDataError(''))
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

describe('POST /api/v1/draft/change-id', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({})) // Access Granted
  })

  it('responds 401 (Unauthorized) when you does not have permission', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(401)
  })

  it('responds 200 (OK) when is successfully operated', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...baseRequest, oldId: mockKeyMap.success }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(200)
  })

  it('responds 404 (Not Found) when old draft id not exists', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...baseRequest, oldId: mockKeyMap.notExists }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(404)
  })

  it('responds 500 (Internal Server Error) when it detected illegal behaviour', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({
        ...baseRequest,
        oldId: mockKeyMap.illegalBehavior,
      }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(500)
  })

  it('responds 409 (Conflict) when new draft id already occupied', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...baseRequest, oldId: mockKeyMap.alreadyExists }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(409)
  })

  it('responds 400 (Bad Request) when new id too long', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...baseRequest, oldId: mockKeyMap.invalidData }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(400)
  })

  it('responds 500 (Internal Server Error) when unkown error occured', async () => {
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({ ...baseRequest, oldId: mockKeyMap.error }),
    })

    const data: NextResponse<any> = await POST(req)

    expect(data.status).toBe(500)
  })
})
