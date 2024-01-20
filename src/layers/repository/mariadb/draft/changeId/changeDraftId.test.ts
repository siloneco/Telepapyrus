jest.mock('./query')

import { Draft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { changeDraftId } from './changeDraftId'
import { saveDraft } from '../save/saveDraft'
import { getQuery as dummyGetQuery } from './query'

const { getQuery } = jest.requireActual('./query')

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
}

const milliSec = () => {
  return new Date().getTime()
}

describe('changeDraftId', () => {
  beforeEach(() => {
    const getQueryMock = dummyGetQuery as jest.Mock
    getQueryMock.mockReturnValue(getQuery())
  })

  it('changes draft id correctly', async () => {
    const id = `tmp-test-draft-changeid-success-${milliSec()}`

    await saveDraft({ ...baseData, id: id })

    expect(await changeDraftId(id, `${id}-new`)).toMatchObject({
      success: true,
    })
  })

  it('rejects when the draft is not exists', async () => {
    const id = `tmp-test-draft-changeid-fail-not-found-${milliSec()}`

    expect(await changeDraftId(id, 'tmp-test-new')).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more drafts affected', async () => {
    const baseId = 'test-draft-changeid-fail-too-many-affected'
    const getQueryMock = dummyGetQuery as jest.Mock
    getQueryMock.mockReturnValue(
      `UPDATE drafts SET id = CONCAT('tmp-', id) WHERE id LIKE '${baseId}-%';`,
    )

    expect(await changeDraftId(baseId, `${baseId}-new`)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-affected',
      },
    })
  })

  it('rejects when new article id already occupied', async () => {
    const baseId = 'test-draft-changeid-fail-already-exists'

    expect(await changeDraftId(`${baseId}-1`, `${baseId}-2`)).toMatchObject({
      success: false,
      error: {
        id: 'already-exists',
      },
    })
  })

  it('rejects when new id is too long', async () => {
    const baseId = 'tmp-test-draft-changeid-fail-invalid-data'
    const longString = '-long-string'.repeat(100)

    await saveDraft({ ...baseData, id: baseId })

    expect(await changeDraftId(baseId, baseId + longString)).toMatchObject({
      success: false,
      error: {
        id: 'invalid-data',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
