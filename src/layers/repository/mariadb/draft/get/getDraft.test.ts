jest.mock('./query')

import { Draft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { getDraft } from './getDraft'
import { getDraftQuery as dummyDraftQuery } from './query'

const { getDraftQuery } = jest.requireActual('./query')

const milliSec = () => {
  return new Date().getTime()
}

describe('getDraft', () => {
  beforeEach(() => {
    const getDraftQueryMock = dummyDraftQuery as jest.Mock
    getDraftQueryMock.mockReturnValue(getDraftQuery())
  })

  it('gets a draft correctly', async () => {
    const draft: Draft = {
      id: `test-get-draft-success`,
      title: 'title',
      content: 'content',
      tags: [],
      public: true,
    }

    const fetched = (await getDraft(draft.id)).data

    expect(fetched).toMatchObject(draft)
  })

  it('rejects when the draft does not exists', async () => {
    const id = `tmp-test-get-fail-id-not-exists-${milliSec()}`

    expect(await getDraft(id)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more drafts selected', async () => {
    const getDraftQueryMock = dummyDraftQuery as jest.Mock
    getDraftQueryMock.mockReturnValue('SELECT * from (VALUES (1), (2)) AS t;')

    const id = `tmp-test-get-fail-too-many-${milliSec()}}`

    expect(await getDraft(id)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-selected',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
