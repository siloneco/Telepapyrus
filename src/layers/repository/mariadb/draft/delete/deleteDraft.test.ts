jest.mock('./query')

import { Draft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { deleteDraft } from './deleteDraft'
import { saveDraft } from '../save/saveDraft'
import { getDeleteDraftSQL as dummyGetDeleteDraftSQL } from './query'

const { getDeleteDraftSQL } = jest.requireActual('./query')

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
  tags: [],
  public: true,
}

const milliSec = () => {
  return new Date().getTime()
}

describe('deleteDraft', () => {
  beforeEach(() => {
    const getDeleteDraftSQLMock = dummyGetDeleteDraftSQL as jest.Mock
    getDeleteDraftSQLMock.mockReturnValue(getDeleteDraftSQL())
  })

  it('deletes draft correctly', async () => {
    const id = `tmp-test-delete-draft-success-${milliSec()}`

    await saveDraft({ ...baseData, id: id })

    expect(await deleteDraft(id)).toMatchObject({
      success: true,
    })
  })

  it('rejects when the draft is not exists', async () => {
    const id = `tmp-test-delete-draft-fail-not-found-${milliSec()}`

    expect(await deleteDraft(id)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more drafts deleted', async () => {
    const baseId = 'test-delete-draft-fail-too-many-deleted'
    const getDeleteDraftSQLMock = dummyGetDeleteDraftSQL as jest.Mock
    getDeleteDraftSQLMock.mockReturnValue(
      `DELETE FROM drafts WHERE id LIKE '${baseId}-%';`,
    )

    expect(await deleteDraft(baseId)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-affected',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
