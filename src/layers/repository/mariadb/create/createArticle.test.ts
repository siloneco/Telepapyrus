import getConnectionPool from '../connection/getConnectionPool'
import { createArticle } from './createArticle'

const baseData = {
  id: 'id',
  title: 'title',
  content: 'content',
  tags: [],
  public: true,
}

const milliSec = () => {
  return new Date().getTime()
}

describe('createArticle', () => {
  it('creates article correctly', async () => {
    const id = `tmp-test-create-success-${milliSec()}`

    expect(
      await createArticle({
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: true,
    })
  })

  it('rejects when id is too long', async () => {
    const longString = 'a'.repeat(256)
    const id = `tmp-test-create-fail-with-id-too-long-${longString}-${milliSec()}`

    expect(
      await createArticle({
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

  it('rejects when tag is invalid', async () => {
    const id = `tmp-test-create-fail-invalid-tag-${milliSec()}`

    expect(
      await createArticle({
        ...baseData,
        id: id,
        tags: [id],
      }),
    ).toMatchObject({
      success: false,
      error: {
        id: 'invalid-data',
      },
    })
  })

  it('rejects when article is already exists', async () => {
    const id = 'test-create-fail-already-exists'

    expect(
      await createArticle({
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
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
