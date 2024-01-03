import { PublishableDraft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { createArticle } from '../create/createArticle'
import { updateArticle } from './updateArticle'

const baseData: PublishableDraft = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  tags: [],
  isPublic: true,
}

const milliSec = () => {
  return new Date().getTime()
}

describe('updateArticle', () => {
  it('updates article correctly', async () => {
    const id = `tmp-test-article-update-success-${milliSec()}`
    const title = `edited title ${milliSec()}`

    await createArticle({ ...baseData, id: id })

    expect(
      await updateArticle({
        ...baseData,
        id: id,
        title: title,
      }),
    ).toMatchObject({
      success: true,
    })
  })

  it('returns error if article not exists', async () => {
    const id = `tmp-test-article-update-not-exists-${milliSec()}`

    expect(
      await updateArticle({
        ...baseData,
        id: id,
      }),
    ).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when tag is invalid', async () => {
    const id = `test-article-update-fail-invalid-tag`
    const notExistsTag = `tmp-test-update-not-exists-tag-${milliSec()}`

    expect(
      await updateArticle({
        ...baseData,
        id: id,
        tags: [notExistsTag],
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
