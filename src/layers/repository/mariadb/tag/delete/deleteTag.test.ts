jest.mock('./query')

import getConnectionPool from '../../connection/getConnectionPool'
import { createTag } from '../create/createTag'
import { deleteTag } from './deleteTag'
import { getDeleteTagSQL as dummyGetDeleteTagSQL } from './query'

const { getDeleteTagSQL } = jest.requireActual('./query')

const milliSec = () => {
  return new Date().getTime()
}

describe('deleteTag', () => {
  beforeEach(() => {
    const getDeleteTagSQLMock = dummyGetDeleteTagSQL as jest.Mock
    getDeleteTagSQLMock.mockReturnValue(getDeleteTagSQL())
  })

  it('deletes tag correctly', async () => {
    const tag = `tmp-test-tag-create-success-${milliSec()}`

    await createTag(tag)

    expect(await deleteTag(tag)).toMatchObject({
      success: true,
    })
  })

  it('rejects when tag not found', async () => {
    const tag = `tmp-test-tag-delete-fail-not-exists-${milliSec()}`

    expect(await deleteTag(tag)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more rows deleted', async () => {
    const tagStartsWith = 'test-tag-delete-fail-too-many-rows-deleted'

    const getDeleteTagSQLMock = dummyGetDeleteTagSQL as jest.Mock
    getDeleteTagSQLMock.mockReturnValue(
      `DELETE FROM allowed_tags WHERE tag LIKE '${tagStartsWith}-%';`,
    )

    expect(await deleteTag(tagStartsWith)).toMatchObject({
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
