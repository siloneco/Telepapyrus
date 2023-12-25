import getConnectionPool from '../../connection/getConnectionPool'
import { createTag } from './createTag'

const milliSec = () => {
  return new Date().getTime()
}

describe('createTag', () => {
  it('creates tag correctly', async () => {
    const tag = `tmp-test-create-tag-success-${milliSec()}`

    expect(await createTag(tag)).toMatchObject({
      success: true,
    })
  })

  it('rejects when tag is too long', async () => {
    const longString = 'a'.repeat(256)
    const tag = `tmp-test-create-tag-fail-with-id-too-long-${longString}-${milliSec()}`

    expect(await createTag(tag)).toMatchObject({
      success: false,
      error: {
        id: 'invalid-data',
      },
    })
  })

  it('rejects when tag is already exists', async () => {
    const tag = 'test-create-fail-already-exists'

    expect(await createTag(tag)).toMatchObject({
      success: false,
      error: {
        id: 'already-exists',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})
