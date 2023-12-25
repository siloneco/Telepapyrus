import { Draft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { saveDraft } from './saveDraft'

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

describe('createDraft', () => {
  it('creates draft correctly', async () => {
    const id = `tmp-test-draft-create-success-${milliSec()}`

    expect(
      await saveDraft({
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: true,
    })
  })

  it('updates draft correctly', async () => {
    const id = `test-draft-create-success-update`

    expect(
      await saveDraft({
        ...baseData,
        id: id,
        title: `changed-title-${milliSec()}`,
      }),
    ).toMatchObject({
      success: true,
    })
  })

  it('rejects when id is too long', async () => {
    const longString = 'a'.repeat(256)
    const id = `tmp-test-draft-create-fail-with-id-too-long-${longString}-${milliSec()}`

    expect(
      await saveDraft({
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
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
